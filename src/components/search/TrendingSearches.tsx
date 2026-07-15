import * as React from 'react';
import { movieService } from '../../services/movie.service';
import { tvService } from '../../services/tv.service';
import { MovieData } from '../movie/MovieCard';
import { MovieRow } from '../movie/MovieRow';
import { MovieRowSkeleton } from '../movie/MovieRowSkeleton';
import { Sparkles, Play, TrendingUp } from 'lucide-react';

interface TrendingSearchesProps {
  onPlayMovie: (movie: MovieData) => void;
  onMoreInfo: (movie: MovieData) => void;
  onToggleWatchlist: (movie: MovieData) => void;
  watchlist: Record<string, boolean>;
}

export const TrendingSearches: React.FC<TrendingSearchesProps> = ({
  onPlayMovie,
  onMoreInfo,
  onToggleWatchlist,
  watchlist,
}) => {
  const [trendingMovies, setTrendingMovies] = React.useState<MovieData[]>([]);
  const [trendingTV, setTrendingTV] = React.useState<MovieData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    const fetchTrending = async () => {
      setLoading(true);
      try {
        const [movies, tvShows] = await Promise.all([
          movieService.getWeeklyTrendingMovies(),
          tvService.getWeeklyTrendingTV(),
        ]);
        if (active) {
          setTrendingMovies(movies.slice(0, 12));
          setTrendingTV(tvShows.slice(0, 12));
        }
      } catch (err) {
        console.error('Error loading trending searches:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchTrending();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-12 w-full pt-4">
        <MovieRowSkeleton />
        <MovieRowSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-12 w-full text-left" id="trending-searches-row">
      {/* Popular Fast Tags */}
      <div className="bg-[#141419]/50 border border-white/[0.04] p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary animate-pulse" />
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Popular Searches
          </h4>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Action', 'Blockbusters', 'Award Winning', 'Trending TV', 'Latest Sci-Fi'].map((tag, i) => (
            <span
              key={i}
              className="px-3.5 py-1.5 rounded-full bg-white/[0.03] text-xs font-bold text-text-secondary border border-white/[0.04] hover:text-white hover:border-[#8B5CF6]/35 transition-all select-none cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Trending Movies Row */}
      {trendingMovies.length > 0 && (
        <MovieRow
          title="Trending Movies This Week"
          movies={trendingMovies}
          onPlayMovie={onPlayMovie}
          onMoreInfo={onMoreInfo}
          onToggleWatchlist={onToggleWatchlist}
          watchlist={watchlist}
        />
      )}

      {/* Trending TV Shows Row */}
      {trendingTV.length > 0 && (
        <MovieRow
          title="Trending TV Shows This Week"
          movies={trendingTV}
          onPlayMovie={onPlayMovie}
          onMoreInfo={onMoreInfo}
          onToggleWatchlist={onToggleWatchlist}
          watchlist={watchlist}
        />
      )}
    </div>
  );
};
