import * as React from 'react';
import { MediaDetailsLayout } from '../Media/MediaDetailsLayout';
import { MediaLoading } from '../Media/MediaLoading';
import { MediaError } from '../Media/MediaError';
import { TVAdapter } from '../../lib/api/mediaAdapter';
import { MediaItem } from '../../types/media';
import { tvService } from '../../services/tv.service';
import { MovieData } from '../movie/MovieCard';
import { navigate, getDetailsPath } from '../../lib/router';
import { updateClientSEO, generateTVSeriesJsonLd, generateBreadcrumbsJsonLd } from '../../lib/seo';
import { generateTVSeriesSchema, generateBreadcrumbListSchema, injectSchema, clearSchema } from '../../lib/schema';

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
  const [rawDetails, setRawDetails] = React.useState<any | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Strip prefix "tv-" if present to get the raw TMDB ID
  const rawTmdbId = tvId.replace('tv-', '').split('-')[0];

  const fetchDetails = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const details = await tvService.getFullTVDetails(rawTmdbId);
      const mapped = TVAdapter.toMediaItem(details);
      setMediaItem(mapped);
      setRawDetails(details);
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

  React.useEffect(() => {
    if (mediaItem) {
      const canonicalPath = getDetailsPath(mediaItem.id, mediaItem.title);
      if (window.location.pathname !== canonicalPath) {
        navigate(canonicalPath, { replace: true });
      }
    }
  }, [mediaItem]);

  React.useEffect(() => {
    if (mediaItem) {
      const jsonLd = generateTVSeriesJsonLd({
        name: mediaItem.title,
        description: mediaItem.overview || `Binge watch ${mediaItem.title} seasons and episodes in high definition on MoviyFly.`,
        image: mediaItem.backdrop || mediaItem.poster || '',
        genre: mediaItem.genres ? mediaItem.genres.map(g => g.name) : [],
        numberOfSeasons: mediaItem.seasonCount || rawDetails?.number_of_seasons || 1,
        numberOfEpisodes: mediaItem.episodeCount || rawDetails?.number_of_episodes,
        ratingValue: mediaItem.rating,
        ratingCount: rawDetails?.vote_count,
        url: window.location.href,
      });

      const breadcrumbsLd = generateBreadcrumbsJsonLd([
        {
          name: 'Home',
          item: 'https://moviyfly.vercel.app/',
        },
        {
          name: 'TV Shows',
          item: 'https://moviyfly.vercel.app/tvshows',
        },
        {
          name: mediaItem.title,
          item: `https://moviyfly.vercel.app/tv/${tvId}`,
        },
      ]);

      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://moviyfly.vercel.app';
      const cleanUrl = `${origin}/tv/${tvId}`;

      updateClientSEO({
        title: `${mediaItem.title} - Stream TV Show on MoviyFly`,
        description: mediaItem.overview || `Binge watch ${mediaItem.title} seasons and episodes in high definition on MoviyFly.`,
        image: mediaItem.backdrop || mediaItem.poster,
        type: 'video.tv_show',
        url: cleanUrl,
        jsonLd: jsonLd,
        breadcrumbsLd: breadcrumbsLd,
      });
    }
  }, [mediaItem, rawDetails]);

  // Schema.org structured data injection
  React.useEffect(() => {
    if (mediaItem) {
      const imageUrl = mediaItem.backdrop || mediaItem.poster || '';
      const tvSchema = generateTVSeriesSchema({
        name: mediaItem.title,
        description: mediaItem.overview || `Binge watch ${mediaItem.title} seasons and episodes in high definition on MoviyFly.`,
        poster: imageUrl,
        firstAirDate: mediaItem.releaseDate || '',
        genres: mediaItem.genres ? mediaItem.genres.map(g => g.name) : [],
        numberOfSeasons: mediaItem.seasonCount || rawDetails?.number_of_seasons || 1,
        rating: {
          ratingValue: mediaItem.rating,
          ratingCount: rawDetails?.vote_count || 100,
        },
        tmdbId: rawTmdbId,
        canonicalUrl: `https://moviyfly.vercel.app/tv/${rawTmdbId}`,
        inLanguage: rawDetails?.original_language,
      });

      const breadcrumbsSchema = generateBreadcrumbListSchema([
        { name: 'Home', item: 'https://moviyfly.vercel.app/' },
        { name: 'TV Shows', item: 'https://moviyfly.vercel.app/tvshows' },
        { name: mediaItem.title, item: `https://moviyfly.vercel.app/tv/${rawTmdbId}` },
      ]);

      injectSchema(tvSchema, 'moviyfly-tv-schema');
      injectSchema(breadcrumbsSchema, 'moviyfly-tv-breadcrumbs-schema');
    }

    return () => {
      clearSchema('moviyfly-tv-schema');
      clearSchema('moviyfly-tv-breadcrumbs-schema');
    };
  }, [mediaItem, rawDetails, rawTmdbId]);

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
