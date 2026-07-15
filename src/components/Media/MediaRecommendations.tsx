import * as React from 'react';
import { MovieRow } from '../movie/MovieRow';
import { MovieData } from '../movie/MovieCard';
import { movieService } from '../../services/movie.service';
import { tvService } from '../../services/tv.service';
import { MovieRowSkeleton } from '../movie/MovieRowSkeleton';

interface MediaRecommendationsProps {
  mediaId: string | number;
  mediaType: 'movie' | 'tv';
  type: 'similar' | 'recommendations';
  onPlayMovie: (movie: MovieData) => void;
  onMoreInfo: (movie: MovieData) => void;
  onToggleWatchlist: (movie: MovieData) => void;
  watchlist: Record<string, boolean>;
}

export const MediaRecommendations: React.FC<MediaRecommendationsProps> = ({
  mediaId,
  mediaType,
  type,
  onPlayMovie,
  onMoreInfo,
  onToggleWatchlist,
  watchlist,
}) => {
  const [items, setItems] = React.useState<MovieData[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    const fetchItems = async () => {
      setLoading(true);
      try {
        const rawId = String(mediaId).replace('movie-', '').replace('tv-', '');
        let results: MovieData[] = [];
        
        if (mediaType === 'movie') {
          if (type === 'recommendations') {
            results = await movieService.getMovieRecommendations(rawId);
          } else {
            results = await movieService.getSimilarMovies(rawId);
          }
        } else {
          if (type === 'recommendations') {
            results = await tvService.getTVRecommendations(rawId);
          } else {
            results = await tvService.getSimilarTV(rawId);
          }
        }

        if (active) {
          setItems(results);
        }
      } catch (err) {
        console.error(`Error fetching media ${type}:`, err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchItems();
    return () => {
      active = false;
    };
  }, [mediaId, mediaType, type]);

  if (loading) {
    return <MovieRowSkeleton />;
  }

  if (items.length === 0) return null;

  const title = type === 'recommendations' ? 'Recommendations For You' : 'More Like This';

  return (
    <MovieRow
      title={title}
      movies={items}
      onPlayMovie={onPlayMovie}
      onMoreInfo={onMoreInfo}
      onToggleWatchlist={onToggleWatchlist}
      watchlist={watchlist}
    />
  );
};
