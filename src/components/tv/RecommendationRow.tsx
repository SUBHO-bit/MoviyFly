import * as React from 'react';
import { MovieRow } from '../movie/MovieRow';
import { MovieData } from '../movie/MovieCard';
import { tvService } from '../../services/tv.service';
import { MovieRowSkeleton } from '../movie/MovieRowSkeleton';

interface RecommendationRowProps {
  tvId: string | number;
  onPlayMovie: (movie: MovieData) => void;
  onMoreInfo: (movie: MovieData) => void;
  onToggleWatchlist: (movie: MovieData) => void;
  watchlist: Record<string, boolean>;
}

export const RecommendationRow: React.FC<RecommendationRowProps> = ({
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
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        const results = await tvService.getTVRecommendations(tvId);
        if (active) {
          setMovies(results);
        }
      } catch (err) {
        console.error('Error fetching TV recommendations:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchRecommendations();
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
      title="Recommendations For You"
      movies={movies}
      onPlayMovie={onPlayMovie}
      onMoreInfo={onMoreInfo}
      onToggleWatchlist={onToggleWatchlist}
      watchlist={watchlist}
    />
  );
};
