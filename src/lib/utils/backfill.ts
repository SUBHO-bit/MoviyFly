import { MovieData } from '../../components/movie/MovieCard';

/**
 * Reusable row loader & backfill utility that guarantees every category row
 * reaches its target item count (e.g., 18 items) without leaving half-empty rows.
 *
 * 1. Fetches items page by page (page 1, page 2, page 3, etc.) from TMDB.
 * 2. Filters out items already in global `seenIds`.
 * 3. Keeps track of duplicate candidates as fallback in case TMDB results run short.
 * 4. If duplicate filtering leaves the row short of targetCount, backfills from candidates.
 * 5. Automatically updates global `seenIds` with all chosen items.
 */
export async function fillCategoryRow(
  fetcher: (page: number) => Promise<MovieData[]>,
  seenIds: Set<string>,
  targetCount: number = 18,
  maxPages: number = 6,
  filterFn?: (item: MovieData) => boolean
): Promise<MovieData[]> {
  const result: MovieData[] = [];
  const resultIds = new Set<string>();
  const fallbackCandidates: MovieData[] = [];

  for (let page = 1; page <= maxPages; page++) {
    if (result.length >= targetCount) break;

    try {
      const items = await fetcher(page);
      if (!items || items.length === 0) break;

      for (const item of items) {
        if (!item || !item.id) continue;
        if (filterFn && !filterFn(item)) continue;

        if (seenIds.has(item.id)) {
          if (!fallbackCandidates.some(c => c.id === item.id)) {
            fallbackCandidates.push(item);
          }
        } else if (!resultIds.has(item.id)) {
          result.push(item);
          resultIds.add(item.id);
          if (result.length >= targetCount) break;
        }
      }
    } catch (e) {
      console.warn(`[fillCategoryRow] Error fetching page ${page}:`, e);
      break;
    }
  }

  // If duplicate filtering still leaves row short, backfill from candidates to guarantee a full row
  if (result.length < targetCount && fallbackCandidates.length > 0) {
    for (const cand of fallbackCandidates) {
      if (result.length >= targetCount) break;
      if (!resultIds.has(cand.id)) {
        result.push(cand);
        resultIds.add(cand.id);
      }
    }
  }

  // Register all items in this row into seenIds
  result.forEach(item => seenIds.add(item.id));

  return result;
}
