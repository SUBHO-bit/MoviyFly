import { fetchFromTMDB } from '../lib/api/tmdb';
import { TMDBTVResponse, TMDBTVDetails, TMDBSeasonDetails } from '../types/tv';
import { mapTMDBTVToMovieData, setDynamicTVGenres } from '../lib/api/mappers';
import { MovieData } from '../components/movie/MovieCard';
import { getPosterUrl, getBackdropUrl } from '../config/tmdb';

const tvDetailsCache = new Map<string, Promise<MovieData>>();
const fullTvDetailsCache = new Map<string, Promise<TMDBTVDetails>>();
const tvListCache = new Map<string, Promise<MovieData[]>>();

/**
 * High-fidelity, recursive/paginated TMDB fetcher that validates each returned TV show's required assets.
 * If less than the target count of valid shows is collected on the first page, it automatically
 * requests additional pages to fully satisfy visual layout and prevent empty carousel items (Task 8).
 * Rigorously logs all properties, skipper, and fallback information (Task 7).
 */
async function getValidTVWithPagination(
  sectionName: string,
  endpoint: string,
  params: Record<string, string | number | boolean | undefined> = {},
  startPage: number = 1,
  targetCount: number = 20,
  maxPagesToFetch: number = 5
): Promise<MovieData[]> {
  const cacheKey = JSON.stringify({ endpoint, params, startPage, targetCount, maxPagesToFetch });
  if (tvListCache.has(cacheKey)) {
    console.log(`[Cache Hit] Returning cached promise for tv section: ${sectionName} (${endpoint})`);
    return tvListCache.get(cacheKey)!;
  }

  const promise = (async () => {
    const accumulated: MovieData[] = [];
    let page = startPage;
    let fallbackUsed = false;
    let fallbackReason = '';

    while (accumulated.length < targetCount && page < startPage + maxPagesToFetch) {
      try {
        const data = await fetchFromTMDB<TMDBTVResponse>(endpoint, { ...params, page });
        
        if (!data || !data.results || data.results.length === 0) {
          break;
        }

        for (const item of data.results) {
          if (accumulated.length >= targetCount) break;

          const mapped = mapTMDBTVToMovieData(item);
          
          let skipReason = '';
          let isVal = true;

          if (!item.name && !item.original_name) {
            isVal = false;
            skipReason = 'Missing title/name';
          } else if (!item.poster_path || item.poster_path === 'null' || item.poster_path === 'undefined') {
            isVal = false;
            skipReason = 'poster_path is null, empty, or undefined';
          } else if (!item.backdrop_path || item.backdrop_path === 'null' || item.backdrop_path === 'undefined') {
            isVal = false;
            skipReason = 'backdrop_path is null, empty, or undefined';
          } else if (!item.overview || item.overview.trim() === '') {
            isVal = false;
            skipReason = 'overview is empty or missing';
          } else if (!item.first_air_date || item.first_air_date.trim() === '') {
            isVal = false;
            skipReason = 'first_air_date is missing or invalid';
          } else if (item.vote_average === undefined || item.vote_average === null) {
            isVal = false;
            skipReason = 'vote_average is undefined or null';
          } else if (item.vote_count === undefined || item.vote_count === null) {
            isVal = false;
            skipReason = 'vote_count is undefined or null';
          }

          // Output extremely comprehensive console logging matching Task 7
          console.log(`--- TMDB API TV VALIDATION LOG ---`);
          console.log(`Section Name: ${sectionName}`);
          console.log(`TMDB Endpoint: ${endpoint} (Page: ${page})`);
          console.log(`TV ID: ${item.id}`);
          console.log(`title/name: ${item.name || item.original_name}`);
          console.log(`poster_path: ${item.poster_path || 'null'}`);
          console.log(`backdrop_path: ${item.backdrop_path || 'null'}`);
          console.log(`Generated Poster URL: ${mapped.poster}`);
          console.log(`Generated Backdrop URL: ${mapped.backdrop}`);
          if (!isVal) {
            console.log(`Reason for skipping a movie: ${skipReason}`);
          } else {
            console.log(`Status: VALID (Included in section)`);
          }
          console.log(`-----------------------------------`);

          if (isVal) {
            if (!accumulated.some(m => m.id === mapped.id)) {
              accumulated.push(mapped);
            }
          }
        }
      } catch (err: any) {
        fallbackUsed = true;
        fallbackReason = err.message || String(err);
        console.log(`--- TMDB API TV REQUEST FAILURE ---`);
        console.log(`Section Name: ${sectionName}`);
        console.log(`TMDB Endpoint: ${endpoint}`);
        console.log(`Reason for using fallback: TMDB Request Failed - ${fallbackReason}`);
        console.log(`-------------------------------------`);
        break;
      }

      page++;
    }

    return accumulated;
  })();

  tvListCache.set(cacheKey, promise);
  return promise;
}

export const tvService = {
  /**
   * Fetch Trending TV Shows (Daily)
   */
  async getTrendingTV(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('Trending TV (Daily)', '/trending/tv/day', {}, page, 20);
  },

  /**
   * Fetch Trending TV Shows (Weekly)
   */
  async getWeeklyTrendingTV(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('Trending TV (Weekly)', '/trending/tv/week', {}, page, 20);
  },

  /**
   * Fetch Popular TV Shows
   */
  async getPopularTV(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('Popular TV Shows', '/tv/popular', {}, page, 20);
  },

  /**
   * Fetch Top Rated TV Shows
   */
  async getTopRatedTV(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('Top Rated TV Shows', '/tv/top_rated', {}, page, 20);
  },

  /**
   * Search TV Shows
   */
  async searchTV(query: string, page: number = 1): Promise<MovieData[]> {
    if (!query.trim()) return [];
    return getValidTVWithPagination(`Search TV: ${query}`, '/search/tv', { query }, page, 20, 1);
  },

  /**
   * Fetch Similar TV Shows
   */
  async getSimilarTV(id: string | number, page: number = 1): Promise<MovieData[]> {
    const cleanId = String(id).replace('tv-', '');
    return getValidTVWithPagination(`Similar TV: ${cleanId}`, `/tv/${cleanId}/similar`, {}, page, 15, 2);
  },

  /**
   * Fetch Premium Platform TV Shows (Netflix, Amazon, HBO, Disney+, Apple TV+)
   */
  async getPremiumPlatformTV(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('Premium Platform TV', '/discover/tv', {
      with_networks: '213|1024|49|2739|2552',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch Japanese Anime TV Shows
   */
  async getAnime(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('Anime Series', '/discover/tv', {
      with_genres: 16,
      with_original_language: 'ja',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch Korean Dramas (K-Dramas)
   */
  async getKDramas(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('Korean Dramas', '/discover/tv', {
      with_original_language: 'ko',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch TV Details
   */
  async getTVDetails(id: string | number): Promise<MovieData> {
    const cleanId = String(id).replace('tv-', '');
    if (tvDetailsCache.has(cleanId)) {
      return tvDetailsCache.get(cleanId)!;
    }
    const promise = (async () => {
      const data = await fetchFromTMDB<TMDBTVDetails>(`/tv/${cleanId}`);
      const airYear = data.first_air_date ? data.first_air_date.split('-')[0] : 'N/A';
      const seasonsLabel = data.number_of_seasons > 1 ? `${data.number_of_seasons} Seasons` : `${data.number_of_seasons || 1} Season`;

      return {
        id: `tv-${data.id}`,
        title: data.name || data.original_name || 'Untitled Show',
        overview: data.overview || 'No overview available.',
        genres: data.genres ? data.genres.map(g => g.name) : [],
        rating: data.vote_average ? data.vote_average.toFixed(1) : '0.0',
        year: airYear,
        runtime: seasonsLabel,
        language: data.original_language?.toUpperCase() || 'EN',
        ageRating: 'TV-14',
        poster: getPosterUrl(data.poster_path),
        backdrop: getBackdropUrl(data.backdrop_path),
        popularity: data.popularity,
        voteCount: data.vote_count,
      };
    })();
    tvDetailsCache.set(cleanId, promise);
    return promise;
  },

  /**
   * Fetch raw TMDB TV Details
   */
  async getFullTVDetails(id: string | number): Promise<TMDBTVDetails> {
    const cleanId = String(id).replace('tv-', '');
    if (fullTvDetailsCache.has(cleanId)) {
      return fullTvDetailsCache.get(cleanId)!;
    }
    const promise = fetchFromTMDB<TMDBTVDetails>(`/tv/${cleanId}`);
    fullTvDetailsCache.set(cleanId, promise);
    return promise;
  },

  /**
   * Fetch TV Credits
   */
  async getTVCredits(id: string | number): Promise<{ id: number; cast: { id: number; name: string; character: string; profile_path: string | null }[] }> {
    const cleanId = String(id).replace('tv-', '');
    return await fetchFromTMDB<{ id: number; cast: any[] }>(`/tv/${cleanId}/credits`);
  },

  /**
   * Fetch TV Videos (Trailers)
   */
  async getTVVideos(id: string | number): Promise<{ id: number; results: { id: string; key: string; name: string; site: string; type: string; official: boolean }[] }> {
    const cleanId = String(id).replace('tv-', '');
    return await fetchFromTMDB<{ id: number; results: any[] }>(`/tv/${cleanId}/videos`);
  },

  /**
   * Fetch TV Recommendations
   */
  async getTVRecommendations(id: string | number, page: number = 1): Promise<MovieData[]> {
    const cleanId = String(id).replace('tv-', '');
    return getValidTVWithPagination(`TV Recommendations: ${cleanId}`, `/tv/${cleanId}/recommendations`, {}, page, 15, 2);
  },

  /**
   * Fetch TV Season Details (Episodes)
   */
  async getTVSeasonDetails(id: string | number, seasonNumber: number): Promise<TMDBSeasonDetails> {
    const cleanId = String(id).replace('tv-', '');
    return await fetchFromTMDB<TMDBSeasonDetails>(`/tv/${cleanId}/season/${seasonNumber}`);
  },

  /**
   * Fetch TV Shows Airing Today
   */
  async getAiringToday(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('TV Airing Today', '/tv/airing_today', {}, page, 20);
  },

  /**
   * Fetch TV Shows On The Air
   */
  async getOnTheAir(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('TV On The Air', '/tv/on_the_air', {}, page, 20);
  },

  /**
   * Fetch Indian TV Series (Hindi, Tamil, Telugu, Malayalam, Kannada, Bengali)
   */
  async getIndianTVSeries(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('Indian TV Series', '/discover/tv', {
      with_original_language: 'hi|ta|te|ml|kn|bn',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch International TV Series (English, Spanish, French, German)
   */
  async getInternationalTVSeries(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('International TV Series', '/discover/tv', {
      with_original_language: 'en|es|fr|de',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch Netflix TV Series (Network 213)
   */
  async getNetflixOriginals(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('Netflix Originals', '/discover/tv', {
      with_networks: '213',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch Apple TV+ TV Series (Network 2552)
   */
  async getAppleTVOriginals(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('Apple TV Originals', '/discover/tv', {
      with_networks: '2552',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch HBO TV Series (Network 49)
   */
  async getHBOOriginals(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('HBO Originals', '/discover/tv', {
      with_networks: '49',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch Disney+ TV Series (Network 2739)
   */
  async getDisneyOriginals(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('Disney Originals', '/discover/tv', {
      with_networks: '2739',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch Prime Video TV Series (Network 1024)
   */
  async getPrimeOriginals(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('Prime Originals', '/discover/tv', {
      with_networks: '1024',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch Sci-Fi & Fantasy TV Series (Genre 10765)
   */
  async getSciFiSeries(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('Sci-Fi Series', '/discover/tv', {
      with_genres: '10765',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch Horror / Mystery TV Series (Genre 9648)
   */
  async getHorrorSeries(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('Horror Series', '/discover/tv', {
      with_genres: '9648',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch Comedy TV Series (Genre 35)
   */
  async getComedySeries(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('Comedy Series', '/discover/tv', {
      with_genres: '35',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch Crime & Mystery TV Series (Genres 80 and 9648)
   */
  async getCrimeMysterySeries(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('Crime & Mystery Series', '/discover/tv', {
      with_genres: '80|9648',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch Romance / Drama TV Series (Genre 18 - Drama covers most Romance on TV)
   */
  async getRomanceSeries(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('Romance Series', '/discover/tv', {
      with_genres: '18',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch Action & Adventure TV Series (Genre 10759)
   */
  async getActionSeries(page: number = 1): Promise<MovieData[]> {
    return getValidTVWithPagination('Action Series', '/discover/tv', {
      with_genres: '10759',
      sort_by: 'popularity.desc'
    }, page, 20);
  },

  /**
   * Fetch a highly curated TV hero banner pool
   */
  async getHeroTVPool(): Promise<MovieData[]> {
    try {
      await tvService.fetchAndSetTVGenres();
      
      const fetchWithFallback = async <T,>(promise: Promise<T[]>, fallback: T[] = []): Promise<T[]> => {
        try {
          return await promise;
        } catch (e) {
          console.warn('Failed fetching TV hero subset:', e);
          return fallback;
        }
      };

      const [
        trending,
        popular,
        airingToday,
        onTheAir,
        topRated,
        indian,
        international
      ] = await Promise.all([
        fetchWithFallback(tvService.getTrendingTV()),
        fetchWithFallback(tvService.getPopularTV()),
        fetchWithFallback(tvService.getAiringToday()),
        fetchWithFallback(tvService.getOnTheAir()),
        fetchWithFallback(tvService.getTopRatedTV()),
        fetchWithFallback(tvService.getIndianTVSeries()),
        fetchWithFallback(tvService.getInternationalTVSeries())
      ]);

      // Combine and filter out any items with missing backdrops or brief overview descriptions
      const allCandidates = [
        ...trending,
        ...popular,
        ...airingToday,
        ...onTheAir,
        ...topRated,
        ...indian,
        ...international
      ];

      const seen = new Set<string>();
      const filtered = allCandidates.filter(m => {
        if (!m || !m.id) return false;
        if (seen.has(m.id)) return false;
        seen.add(m.id);

        if (!m.backdrop || m.backdrop.endsWith('null') || m.backdrop.includes('photo-1547483238-2cbf88bd1423')) return false;
        if (!m.overview || m.overview.trim().length < 25) return false;

        return true;
      });

      // Sort or shuffle to keep it dynamic, e.g. mix Indian and International
      // Let's take the top 15 most popular/relevant
      return filtered.slice(0, 15);
    } catch (e) {
      console.error('Failed to compile TV hero pool:', e);
      // fallback
      const trending = await tvService.getTrendingTV().catch(() => []);
      return trending.slice(0, 5);
    }
  },

  /**
   * Fetch TV Genres and dynamically populate the mapper
   */
  async fetchAndSetTVGenres(): Promise<void> {
    try {
      const data = await fetchFromTMDB<{ genres: { id: number; name: string }[] }>('/genre/tv/list');
      if (data && data.genres) {
        setDynamicTVGenres(data.genres);
      }
    } catch (e) {
      console.warn('Failed to fetch dynamic TV genres, using pre-defined map:', e);
    }
  }
};
