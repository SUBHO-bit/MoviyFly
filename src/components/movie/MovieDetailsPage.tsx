import * as React from 'react';
import { MediaDetailsLayout } from '../Media/MediaDetailsLayout';
import { MediaLoading } from '../Media/MediaLoading';
import { MediaError } from '../Media/MediaError';
import { MovieAdapter, TVAdapter } from '../../lib/api/mediaAdapter';
import { MediaItem } from '../../types/media';
import { movieService } from '../../services/movie.service';
import { tvService } from '../../services/tv.service';
import { MovieData } from './MovieCard';
import { navigate } from '../../lib/router';

interface MovieDetailsPageProps {
  movieId: string;
  watchlist: Record<string, boolean>;
  onToggleWatchlist: (movie: MovieData) => void;
}

export const MovieDetailsPage: React.FC<MovieDetailsPageProps> = ({
  movieId,
  watchlist,
  onToggleWatchlist,
}) => {
  const [mediaItem, setMediaItem] = React.useState<MediaItem | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Strip prefix "movie-" or "tv-" if present to get the raw TMDB ID
  const isTv = movieId.startsWith('tv-');
  const rawTmdbId = movieId.replace('movie-', '').replace('tv-', '');

  const fetchMediaDetails = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (isTv) {
        const tvDetails = await tvService.getFullTVDetails(rawTmdbId);
        const mapped = TVAdapter.toMediaItem(tvDetails);
        setMediaItem(mapped);
      } else {
        const movieDetails = await movieService.getFullMovieDetails(rawTmdbId);
        const mapped = MovieAdapter.toMediaItem(movieDetails);
        setMediaItem(mapped);
      }
    } catch (err: any) {
      console.error('Error fetching TMDB media details:', err);
      setError(err.message || 'The cinematic details could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [rawTmdbId, isTv]);

  React.useEffect(() => {
    fetchMediaDetails();
    // Scroll to top when media changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [movieId, fetchMediaDetails]);

  const handleBackToCatalog = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/home');
    }
  };

  if (loading) {
    return <MediaLoading />;
  }

  if (error || !mediaItem) {
    return (
      <MediaError
        error={error || 'Title Not Found'}
        onBack={handleBackToCatalog}
        onRetry={fetchMediaDetails}
      />
    );
  }

  return (
    <MediaDetailsLayout
      media={mediaItem}
      watchlist={watchlist}
      onToggleWatchlist={onToggleWatchlist}
    />
  );
};
