import * as React from 'react';
import { MovieRow } from './MovieRow';
import { MovieData } from './MovieCard';
import { movieService } from '../../services/movie.service';
import { tvService } from '../../services/tv.service';
import { MovieRowSkeleton } from './MovieRowSkeleton';

interface RecommendationRowProps {
  movieId: string | number;
  onPlayMovie?: (movie: MovieData) => void;
  onMoreInfo?: (movie: MovieData) => void;
  onToggleWatchlist?: (movie: MovieData) => void;
  watchlist?: Record<string, boolean>;
}

export const RecommendationRow: React.FC<RecommendationRowProps> = ({
  movieId,
  onPlayMovie,
  onMoreInfo,
  onToggleWatchlist,
  watchlist,
}) => {
  const [movies, setMovies] = React.useState<MovieData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const isTv = String(movieId).startsWith('tv-');
        const results = isTv 
          ? await tvService.getTVRecommendations(movieId)
          : await movieService.getMovieRecommendations(movieId);

        if (active) {
          setMovies(results);
        }
      } catch (e) {
        console.warn('Failed to load recommended movies:', e);
        if (active) setMovies([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchRecommendations();
    return () => {
      active = false;
    };
  }, [movieId]);

  if (loading) {
    return <MovieRowSkeleton />;
  }

  if (movies.length === 0) return null;

  return (
    <MovieRow
      title="Recommended For You"
      movies={movies}
      onPlayMovie={onPlayMovie}
      onMoreInfo={onMoreInfo}
      onToggleWatchlist={onToggleWatchlist}
      watchlist={watchlist}
    />
  );
};
