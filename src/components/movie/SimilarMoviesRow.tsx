import * as React from 'react';
import { MovieRow } from './MovieRow';
import { MovieData } from './MovieCard';
import { movieService } from '../../services/movie.service';
import { tvService } from '../../services/tv.service';
import { MovieRowSkeleton } from './MovieRowSkeleton';

interface SimilarMoviesRowProps {
  movieId: string | number;
  onPlayMovie?: (movie: MovieData) => void;
  onMoreInfo?: (movie: MovieData) => void;
  onToggleWatchlist?: (movie: MovieData) => void;
  watchlist?: Record<string, boolean>;
}

export const SimilarMoviesRow: React.FC<SimilarMoviesRowProps> = ({
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
    const fetchSimilar = async () => {
      setLoading(true);
      try {
        const isTv = String(movieId).startsWith('tv-');
        const results = isTv 
          ? await tvService.getSimilarTV(movieId)
          : await movieService.getSimilarMovies(movieId);

        if (active) {
          setMovies(results);
        }
      } catch (e) {
        console.warn('Failed to load similar movies:', e);
        if (active) setMovies([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchSimilar();
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
      title="More Like This"
      movies={movies}
      onPlayMovie={onPlayMovie}
      onMoreInfo={onMoreInfo}
      onToggleWatchlist={onToggleWatchlist}
      watchlist={watchlist}
    />
  );
};
