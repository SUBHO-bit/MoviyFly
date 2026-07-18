import * as React from 'react';
import { MovieCard, MovieData } from '../movie/MovieCard';
import { SearchSkeleton } from './SearchSkeleton';
import { EmptySearch } from './EmptySearch';
import { Clapperboard } from 'lucide-react';

interface SearchResultsProps {
  results: MovieData[];
  watchlist: Record<string, boolean>;
  onPlayMovie: (movie: MovieData) => void;
  onMoreInfo: (movie: MovieData) => void;
  onToggleWatchlist: (movie: MovieData) => void;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  watchlist,
  onPlayMovie,
  onMoreInfo,
  onToggleWatchlist,
  isLoading,
  hasMore,
  onLoadMore,
}) => {
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  // Set up intersection observer for infinite scroll
  React.useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  if (results.length === 0 && !isLoading) {
    return <EmptySearch />;
  }

  return (
    <div className="w-full space-y-6 text-left" id="search-results-section">
      <div className="flex items-center gap-2 px-1">
        <Clapperboard className="h-4.5 w-4.5 text-primary" />
        <span className="text-xs font-black uppercase tracking-widest text-text-secondary">
          Found {results.length} Matches
        </span>
      </div>

      {/* Grid items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 w-full">
        {results.map((movie) => {
          const movieIdStr = String(movie.id);
          const rawId = movieIdStr.replace('movie-', '').replace('tv-', '');
          const isInWatchlist = !!(
            watchlist[movieIdStr] ||
            watchlist[rawId] ||
            watchlist[`movie-${rawId}`] ||
            watchlist[`tv-${rawId}`]
          );
          return (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWatchlist={isInWatchlist}
              onPlay={onPlayMovie}
              onMoreInfo={onMoreInfo}
              onToggleWatchlist={onToggleWatchlist}
            />
          );
        })}
      </div>

      {/* Bottom marker for Infinite Scroll loading */}
      {hasMore && (
        <div ref={loadMoreRef} className="h-10 w-full flex items-center justify-center py-8">
          {isLoading && (
            <div className="flex items-center gap-2 text-text-muted text-xs font-bold animate-pulse">
              <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
              <span>Streaming more results...</span>
            </div>
          )}
        </div>
      )}

      {/* Render skeleton cards if we are loading initial results and list is empty */}
      {isLoading && results.length === 0 && (
        <SearchSkeleton />
      )}
    </div>
  );
};
