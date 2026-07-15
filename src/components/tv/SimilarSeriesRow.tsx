import * as React from 'react';
import { MovieRow } from '../movie/MovieRow';
import { MovieData } from '../movie/MovieCard';
import { tvService } from '../../services/tv.service';
import { MovieRowSkeleton } from '../movie/MovieRowSkeleton';

interface SimilarSeriesRowProps {
  tvId: string | number;
  onPlayMovie: (movie: MovieData) => void;
  onMoreInfo: (movie: MovieData) => void;
  onToggleWatchlist: (movie: MovieData) => void;
  watchlist: Record<string, boolean>;
}

export const SimilarSeriesRow: React.FC<SimilarSeriesRowProps> = ({
  tvId,
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
        const results = await tvService.getSimilarTV(tvId);
        if (active) {
          setMovies(results);
        }
      } catch (err) {
        console.error('Error fetching similar TV shows:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchSimilar();
    return () => {
      active = false;
    };
  }, [tvId]);

  if (loading) {
    return <MovieRowSkeleton />;
  }

  if (movies.length === 0) return null;

  return (
    <MovieRow
      title="Similar Shows"
      movies={movies}
      onPlayMovie={onPlayMovie}
      onMoreInfo={onMoreInfo}
      onToggleWatchlist={onToggleWatchlist}
      watchlist={watchlist}
    />
  );
};
