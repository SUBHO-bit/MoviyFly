import * as React from 'react';
import { movieService } from '../../services/movie.service';
import { tvService } from '../../services/tv.service';
import { MovieData } from '../movie/MovieCard';
import { SearchInput } from './SearchInput';
import { SearchFilters, FilterState } from './SearchFilters';
import { SearchResults } from './SearchResults';
import { RecentSearches } from './RecentSearches';
import { TrendingSearches } from './TrendingSearches';
import { fetchFromTMDB } from '../../lib/api/tmdb';
import { mapTMDBMovieToMovieData, mapTMDBTVToMovieData } from '../../lib/api/mappers';
import { getPosterUrl } from '../../config/tmdb';
import { navigate, usePath, getDetailsPath } from '../../lib/router';
import { Search, Info, Sliders, Film, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface SearchPageProps {
  watchlist: Record<string, boolean>;
  onToggleWatchlist: (movie: MovieData) => void;
  onPlayMovie: (movie: MovieData) => void;
}

const DEFAULT_FILTERS: FilterState = {
  mediaType: 'all',
  genreId: 'all',
  year: 'all',
  language: 'all',
  minRating: 0,
  sortBy: 'popularity',
  sortOrder: 'desc',
};

const GENRE_MAP: Record<string, string> = {
  '28': 'Action',
  '12': 'Adventure',
  '16': 'Animation',
  '35': 'Comedy',
  '80': 'Crime',
  '99': 'Documentary',
  '18': 'Drama',
  '14': 'Fantasy',
  '27': 'Horror',
  '10749': 'Romance',
  '878': 'Sci-Fi',
  '53': 'Thriller',
};

export const SearchPage: React.FC<SearchPageProps> = ({
  watchlist,
  onToggleWatchlist,
  onPlayMovie,
}) => {
  const path = usePath();

  // State
  const [query, setQuery] = React.useState('');
  const [rawResults, setRawResults] = React.useState<MovieData[]>([]);
  const [page, setPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Filters Collapsible and values
  const [isFiltersOpen, setIsFiltersOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<FilterState>(DEFAULT_FILTERS);

  // Search History State
  const [history, setHistory] = React.useState<string[]>([]);

  // Initialize search history and sync URL query
  React.useEffect(() => {
    // History
    const saved = localStorage.getItem('moviyfly_search_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse search history', e);
      }
    }

    // URL Query
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('q') || '';
    setQuery(q);
  }, [path]);

  // Handle Search Input Change with URL replacement (avoid page navigation history spam)
  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);

    // Update URL instantly without pushing a state on every single stroke (replace instead)
    const url = newQuery.trim()
      ? `/search?q=${encodeURIComponent(newQuery)}`
      : '/search';
    window.history.replaceState({}, '', url);

    // Also dispatch a custom state event to keep other listeners updated if needed
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  // Run searches when the query or current page increments
  React.useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) {
      setRawResults([]);
      setHasMore(false);
      return;
    }

    let active = true;

    const performSearch = async () => {
      if (page === 1) {
        setIsLoading(true);
      }
      setError(null);

      try {
        // Query TMDB multi search endpoint
        const data = await fetchFromTMDB<{
          results: any[];
          total_pages: number;
          page: number;
        }>('/search/multi', { query: trimmed, page });

        if (!active) return;

        // Map responses
        const mapped: MovieData[] = data.results
          .map((item) => {
            if (item.media_type === 'movie') {
              return mapTMDBMovieToMovieData(item);
            } else if (item.media_type === 'tv') {
              return mapTMDBTVToMovieData(item);
            }
            return null;
          })
          .filter((item): item is MovieData => item !== null);

        if (page === 1) {
          setRawResults(mapped);
          // If query was successful, add it to history!
          saveSearchToHistory(trimmed);
        } else {
          setRawResults((prev) => {
            // De-duplicate items by id
            const existingIds = new Set(prev.map((p) => p.id));
            const uniqueNew = mapped.filter((m) => !existingIds.has(m.id));
            return [...prev, ...uniqueNew];
          });
        }

        setHasMore(data.page < data.total_pages);
      } catch (err: any) {
        if (active) {
          console.error('Search request failed:', err);
          setError(err.message || 'Network request failed. Please check your connection.');
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    // Debounce TMDB search fetching to prevent hitting rate limits
    const delay = setTimeout(() => {
      performSearch();
    }, 350);

    return () => {
      active = false;
      clearTimeout(delay);
    };
  }, [query, page]);

  // Reset page parameter on query changes
  React.useEffect(() => {
    setPage(1);
    setRawResults([]);
    setHasMore(true);
  }, [query]);

  // History Management Helpers
  const saveSearchToHistory = (term: string) => {
    if (!term || term.trim().length < 2) return;
    const cleanTerm = term.trim();

    setHistory((prev) => {
      const filtered = prev.filter((t) => t.toLowerCase() !== cleanTerm.toLowerCase());
      const next = [cleanTerm, ...filtered].slice(0, 10);
      localStorage.setItem('moviyfly_search_history', JSON.stringify(next));
      return next;
    });
  };

  const handleRemoveSearch = (term: string) => {
    setHistory((prev) => {
      const next = prev.filter((t) => t !== term);
      localStorage.setItem('moviyfly_search_history', JSON.stringify(next));
      return next;
    });
  };

  const handleClearHistory = () => {
    localStorage.removeItem('moviyfly_search_history');
    setHistory([]);
  };

  const handleSelectSearch = (term: string) => {
    handleQueryChange(term);
  };

  // Apply filters and sorting client-side for blistering-fast interactions
  const processedResults = React.useMemo(() => {
    let list = [...rawResults];

    // 1. MediaType filter
    if (filters.mediaType !== 'all') {
      const prefix = `${filters.mediaType}-`;
      list = list.filter((m) => m.id.startsWith(prefix));
    }

    // 2. Genre filter
    if (filters.genreId !== 'all') {
      const genreName = GENRE_MAP[filters.genreId];
      if (genreName) {
        list = list.filter((m) => m.genres.includes(genreName));
      }
    }

    // 3. Release Year filter
    if (filters.year !== 'all') {
      list = list.filter((m) => String(m.year) === filters.year);
    }

    // 4. Language filter
    if (filters.language !== 'all') {
      list = list.filter((m) => m.language?.toLowerCase() === filters.language.toLowerCase());
    }

    // 5. Minimum Rating filter
    if (filters.minRating > 0) {
      list = list.filter((m) => parseFloat(String(m.rating)) >= filters.minRating);
    }

    // 6. Sort and Order
    list.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'popularity':
          // Sort by ratings count or score (using rating as fallback)
          comparison = parseFloat(String(b.rating)) - parseFloat(String(a.rating));
          break;
        case 'release_date':
          comparison = String(b.year).localeCompare(String(a.year));
          break;
        case 'rating':
          comparison = parseFloat(String(b.rating)) - parseFloat(String(a.rating));
          break;
        case 'title':
          comparison = String(a.title).localeCompare(String(b.title));
          break;
        default:
          break;
      }

      return filters.sortOrder === 'desc' ? comparison : -comparison;
    });

    return list;
  }, [rawResults, filters]);

  // Handle opening movie card
  const handleMoreInfo = (movie: MovieData) => {
    navigate(getDetailsPath(movie.id, movie.title));
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 py-4 select-none" id="search-page-main">
      {/* Search Header Banner */}
      <div className="flex flex-col gap-2 text-left px-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-white bg-clip-text bg-gradient-to-r from-white via-white to-text-secondary">
          Search & Discover
        </h1>
        <p className="text-xs text-text-secondary leading-relaxed font-medium">
          Browse through movies, TV series, actors, cast, and genres dynamically.
        </p>
      </div>

      {/* Primary Input Panel */}
      <div className="w-full">
        <SearchInput
          value={query}
          onChange={handleQueryChange}
          isFilterOpen={isFiltersOpen}
          onToggleFilter={() => setIsFiltersOpen(!isFiltersOpen)}
        />
      </div>

      {/* Advanced Filter Panel */}
      <SearchFilters
        filters={filters}
        onChangeFilters={setFilters}
        onResetFilters={() => setFilters(DEFAULT_FILTERS)}
        isOpen={isFiltersOpen}
        onToggleOpen={() => setIsFiltersOpen(!isFiltersOpen)}
      />

      {/* Search Content */}
      <div className="w-full">
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="max-w-md p-8 rounded-2xl bg-red-500/5 border border-red-500/10 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="mx-auto h-16 w-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                <Info className="h-7 w-7 text-red-400" />
              </div>
              <h3 className="text-lg font-extrabold text-white tracking-tight mb-2">Search Pipeline Interrupted</h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-6">
                {error}
              </p>
              <button
                onClick={() => setPage(1)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#EF4444] to-[#F87171] text-white font-extrabold text-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-500/10"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry Search Request
              </button>
            </div>
          </div>
        ) : query.trim().length >= 2 ? (
          /* Active Results Display Grid */
          <SearchResults
            results={processedResults}
            watchlist={watchlist}
            onPlayMovie={onPlayMovie}
            onMoreInfo={handleMoreInfo}
            onToggleWatchlist={onToggleWatchlist}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={() => setPage((p) => p + 1)}
          />
        ) : (
          /* Empty query state: Recent and Trending recommendations */
          <div className="space-y-8 animate-fade-in">
            {history.length > 0 && (
              <RecentSearches
                history={history}
                onSelectSearch={handleSelectSearch}
                onRemoveSearch={handleRemoveSearch}
                onClearHistory={handleClearHistory}
              />
            )}

            <TrendingSearches
              onPlayMovie={onPlayMovie}
              onMoreInfo={handleMoreInfo}
              onToggleWatchlist={onToggleWatchlist}
              watchlist={watchlist}
            />
          </div>
        )}
      </div>
    </div>
  );
};
