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
import { updateClientSEO } from '../../lib/seo';

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

  React.useEffect(() => {
    if (mediaItem) {
      const type = isTv ? 'video.tv_show' : 'video.movie';
      const jsonLd = {
        "@context": "https://schema.org",
        "@type": isTv ? "TVSeries" : "Movie",
        "name": mediaItem.title,
        "description": mediaItem.overview || `Stream ${mediaItem.title} on MoviyFly.`,
        "image": mediaItem.poster || mediaItem.backdrop || "",
        "dateCreated": mediaItem.releaseDate || "",
        "genre": mediaItem.genres ? mediaItem.genres.map(g => g.name) : [],
        "aggregateRating": mediaItem.rating ? {
          "@type": "AggregateRating",
          "ratingValue": mediaItem.rating,
          "bestRating": "10",
          "worstRating": "1"
        } : undefined
      };

      updateClientSEO({
        title: `${mediaItem.title} - Stream on MoviyFly`,
        description: mediaItem.overview || `Stream ${mediaItem.title} on MoviyFly with high-quality sources and complete details.`,
        image: mediaItem.backdrop || mediaItem.poster,
        type: type,
        url: window.location.href,
        jsonLd: jsonLd
      });
    }
  }, [mediaItem, isTv]);

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
