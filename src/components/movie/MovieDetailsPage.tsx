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
import { updateClientSEO, generateMovieJsonLd, generateTVSeriesJsonLd, generateBreadcrumbsJsonLd } from '../../lib/seo';
import { generateMovieSchema, generateTVSeriesSchema, generateBreadcrumbListSchema, injectSchema, clearSchema } from '../../lib/schema';

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
  const [rawDetails, setRawDetails] = React.useState<any | null>(null);
  const [credits, setCredits] = React.useState<any | null>(null);
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
        const [tvDetails, tvCredits] = await Promise.all([
          tvService.getFullTVDetails(rawTmdbId),
          tvService.getTVCredits(rawTmdbId).catch(() => ({ cast: [], crew: [] }))
        ]);
        const mapped = TVAdapter.toMediaItem(tvDetails);
        setMediaItem(mapped);
        setRawDetails(tvDetails);
        setCredits(tvCredits);
      } else {
        const [movieDetails, movieCredits] = await Promise.all([
          movieService.getFullMovieDetails(rawTmdbId),
          movieService.getMovieCredits(rawTmdbId).catch(() => ({ cast: [], crew: [] }))
        ]);
        const mapped = MovieAdapter.toMediaItem(movieDetails);
        setMediaItem(mapped);
        setRawDetails(movieDetails);
        setCredits(movieCredits);
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
      let jsonLd: any = undefined;
      const imageUrl = mediaItem.backdrop || mediaItem.poster || '';

      if (isTv) {
        jsonLd = generateTVSeriesJsonLd({
          name: mediaItem.title,
          description: mediaItem.overview || `Binge watch ${mediaItem.title} on MoviyFly.`,
          image: imageUrl,
          genre: mediaItem.genres ? mediaItem.genres.map(g => g.name) : [],
          numberOfSeasons: mediaItem.seasonCount || rawDetails?.number_of_seasons || 1,
          numberOfEpisodes: mediaItem.episodeCount || rawDetails?.number_of_episodes,
          ratingValue: mediaItem.rating,
          ratingCount: rawDetails?.vote_count,
          url: window.location.href,
        });
      } else {
        const actors = credits?.cast?.slice(0, 10).map((actor: any) => ({
          name: actor.name,
          image: actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : undefined,
        }));
        const directors = credits?.crew?.filter((member: any) => member.job === 'Director').map((dir: any) => ({
          name: dir.name,
          image: dir.profile_path ? `https://image.tmdb.org/t/p/w185${dir.profile_path}` : undefined,
        }));

        jsonLd = generateMovieJsonLd({
          name: mediaItem.title,
          description: mediaItem.overview || `Stream ${mediaItem.title} on MoviyFly.`,
          image: imageUrl,
          datePublished: mediaItem.releaseDate || '',
          genre: mediaItem.genres ? mediaItem.genres.map(g => g.name) : [],
          duration: rawDetails?.runtime ? `${rawDetails.runtime}m` : mediaItem.runtime,
          ratingValue: mediaItem.rating,
          ratingCount: rawDetails?.vote_count,
          url: window.location.href,
          actors,
          directors,
        });
      }

      const breadcrumbsLd = generateBreadcrumbsJsonLd([
        {
          name: 'Home',
          item: 'https://moviyfly.vercel.app/',
        },
        {
          name: isTv ? 'TV Shows' : 'Movies',
          item: isTv ? 'https://moviyfly.vercel.app/tvshows' : 'https://moviyfly.vercel.app/movies',
        },
        {
          name: mediaItem.title,
          item: `https://moviyfly.vercel.app/movie/${movieId}`,
        },
      ]);

      updateClientSEO({
        title: `${mediaItem.title} - Stream on MoviyFly`,
        description: mediaItem.overview || `Stream ${mediaItem.title} on MoviyFly with high-quality sources and complete details.`,
        image: mediaItem.backdrop || mediaItem.poster,
        type: type,
        url: window.location.href,
        jsonLd: jsonLd,
        breadcrumbsLd: breadcrumbsLd,
      });
    }
  }, [mediaItem, isTv, rawDetails, credits]);

  // Schema.org structured data injection
  React.useEffect(() => {
    if (mediaItem) {
      const imageUrl = mediaItem.backdrop || mediaItem.poster || '';
      
      if (isTv) {
        const tvSchema = generateTVSeriesSchema({
          name: mediaItem.title,
          description: mediaItem.overview || `Binge watch ${mediaItem.title} on MoviyFly.`,
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
      } else {
        const productionCompany = rawDetails?.production_companies?.map((c: any) => c.name);

        const movieSchema = generateMovieSchema({
          title: mediaItem.title,
          description: mediaItem.overview || `Stream ${mediaItem.title} on MoviyFly.`,
          poster: imageUrl,
          releaseDate: mediaItem.releaseDate || '',
          genres: mediaItem.genres ? mediaItem.genres.map(g => g.name) : [],
          rating: {
            ratingValue: mediaItem.rating,
            ratingCount: rawDetails?.vote_count || 100,
          },
          runtime: rawDetails?.runtime || mediaItem.runtime,
          tmdbId: rawTmdbId,
          canonicalUrl: `https://moviyfly.vercel.app/movie/${rawTmdbId}`,
          inLanguage: rawDetails?.original_language,
          productionCompany: productionCompany && productionCompany.length > 0 ? productionCompany : undefined,
        });

        const breadcrumbsSchema = generateBreadcrumbListSchema([
          { name: 'Home', item: 'https://moviyfly.vercel.app/' },
          { name: 'Movies', item: 'https://moviyfly.vercel.app/movies' },
          { name: mediaItem.title, item: `https://moviyfly.vercel.app/movie/${rawTmdbId}` },
        ]);

        injectSchema(movieSchema, 'moviyfly-movie-schema');
        injectSchema(breadcrumbsSchema, 'moviyfly-movie-breadcrumbs-schema');
      }
    }

    return () => {
      clearSchema('moviyfly-movie-schema');
      clearSchema('moviyfly-movie-breadcrumbs-schema');
      clearSchema('moviyfly-tv-schema');
      clearSchema('moviyfly-tv-breadcrumbs-schema');
    };
  }, [mediaItem, isTv, rawDetails, rawTmdbId]);

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
