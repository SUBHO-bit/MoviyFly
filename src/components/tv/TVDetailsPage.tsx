import * as React from 'react';
import { MediaDetailsLayout } from '../Media/MediaDetailsLayout';
import { MediaLoading } from '../Media/MediaLoading';
import { MediaError } from '../Media/MediaError';
import { TVAdapter } from '../../lib/api/mediaAdapter';
import { MediaItem } from '../../types/media';
import { tvService } from '../../services/tv.service';
import { MovieData } from '../movie/MovieCard';
import { navigate } from '../../lib/router';

interface TVDetailsPageProps {
  tvId: string;
  watchlist: Record<string, boolean>;
  onToggleWatchlist: (movie: MovieData) => void;
}

export const TVDetailsPage: React.FC<TVDetailsPageProps> = ({
  tvId,
  watchlist,
  onToggleWatchlist,
}) => {
  const [mediaItem, setMediaItem] = React.useState<MediaItem | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Strip prefix "tv-" if present to get the raw TMDB ID
  const rawTmdbId = tvId.replace('tv-', '');

  const fetchDetails = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const details = await tvService.getFullTVDetails(rawTmdbId);
      const mapped = TVAdapter.toMediaItem(details);
      setMediaItem(mapped);
    } catch (err: any) {
      console.error('Error fetching TMDB TV details:', err);
      setError(err.message || 'The television details could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [rawTmdbId]);

  React.useEffect(() => {
    fetchDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tvId, fetchDetails]);

  const handleBackToCatalog = () => {
    navigate('/tvshows');
  };

  if (loading) {
    return <MediaLoading />;
  }

  if (error || !mediaItem) {
    return (
      <MediaError
        error={error || 'Show Unavailable'}
        onBack={handleBackToCatalog}
        onRetry={fetchDetails}
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
