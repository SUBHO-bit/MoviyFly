import * as React from 'react';
import { PlayerLoader } from './PlayerLoader';
import { PlayerError } from './PlayerError';
import { StreamingProvider } from './StreamingProvider';
import { TMDBMovieDetails } from '../../types/movie';
import { MovieData } from '../movie/MovieCard';
import { getBackdropUrl, getPosterUrl } from '../../config/tmdb';

interface MoviePlayerProps {
  tmdbId: string;
  title: string;
  activeServerId: string;
  onBackToMovie: () => void;
  onServerChange?: (serverId: string) => void;
  movieDetails?: TMDBMovieDetails | null;
}

export const MoviePlayer: React.FC<MoviePlayerProps> = ({
  tmdbId,
  title,
  activeServerId,
  onBackToMovie,
  onServerChange,
  movieDetails,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [key, setKey] = React.useState(0);

  // When tmdbId or activeServerId changes, reset states to show loader
  React.useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [tmdbId, activeServerId, key]);

  // Listen for Viduki postMessage events (Fallback & MEDIA_DATA for Continue Watching)
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event || !event.data) return;

      let parsedData: any = event.data;
      if (typeof event.data === 'string') {
        try {
          parsedData = JSON.parse(event.data);
        } catch (e) {
          if (event.data === 'viduki:all-servers-failed' || event.data === 'MEDIA_DATA') {
            parsedData = { type: event.data };
          }
        }
      }

      // 1. All servers failed -> Automatic server fallback (API 1 -> API 2 -> API 3 -> API 4)
      const isAllServersFailed =
        parsedData?.type === 'viduki:all-servers-failed' ||
        parsedData === 'viduki:all-servers-failed';

      if (isAllServersFailed) {
        console.warn('[Viduki Movie Player] All servers failed. Auto switching to next server...');
        const nextServer = StreamingProvider.getNextServerId(activeServerId);
        if (nextServer !== activeServerId && onServerChange) {
          onServerChange(nextServer);
        }
        return;
      }

      // 2. MEDIA_DATA -> Save into Continue Watching storage
      const isMediaData =
        parsedData?.type === 'MEDIA_DATA' ||
        parsedData?.event === 'MEDIA_DATA' ||
        parsedData === 'MEDIA_DATA';

      if (isMediaData) {
        const cleanId = (parsedData?.tmdb_id || parsedData?.tmdbId || parsedData?.id || tmdbId)
          .toString()
          .replace('movie-', '')
          .replace('tv-', '');

        try {
          const stored = localStorage.getItem('moviyfly_continue_watching');
          const existing: MovieData[] = stored ? JSON.parse(stored) : [];
          const itemId = `movie-${cleanId}`;

          const existingIdx = existing.findIndex((m) => m.id === itemId || m.id === cleanId);

          const poster = movieDetails?.poster_path
            ? getPosterUrl(movieDetails.poster_path)
            : parsedData?.poster || '';
          const backdrop = movieDetails?.backdrop_path
            ? getBackdropUrl(movieDetails.backdrop_path)
            : parsedData?.backdrop || '';
          const movieTitle = movieDetails?.title || title || parsedData?.title || 'Movie';
          const releaseYear = movieDetails?.release_date
            ? movieDetails.release_date.split('-')[0]
            : parsedData?.year || new Date().getFullYear();

          const movieItem: MovieData = {
            id: itemId,
            title: movieTitle,
            overview: movieDetails?.overview || parsedData?.overview || '',
            genres: movieDetails?.genres ? movieDetails.genres.map((g: any) => g.name) : [],
            rating: movieDetails?.vote_average ? movieDetails.vote_average.toFixed(1) : '0.0',
            year: releaseYear,
            runtime: movieDetails?.runtime ? `${movieDetails.runtime} min` : '2h 15m',
            language: movieDetails?.original_language?.toUpperCase() || 'EN',
            ageRating: 'PG-13',
            poster: poster,
            backdrop: backdrop,
          };

          if (existingIdx >= 0) {
            existing[existingIdx] = { ...existing[existingIdx], ...movieItem };
          } else {
            existing.unshift(movieItem);
          }

          localStorage.setItem('moviyfly_continue_watching', JSON.stringify(existing.slice(0, 20)));
        } catch (err) {
          console.error('Failed to save movie to Continue Watching:', err);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [activeServerId, tmdbId, title, movieDetails, onServerChange]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleRetry = () => {
    setKey((prev) => prev + 1);
  };

  const embedUrl = StreamingProvider.getStreamUrl(activeServerId, tmdbId, 'movie');


  return (
    <div className="w-full max-w-5xl mx-auto" id="watch-player-wrapper">
      {/* 16:9 Aspect Ratio Container with no layout shift */}
      <div className="relative w-full aspect-video rounded-[24px] md:rounded-[32px] overflow-hidden bg-black border border-white/[0.06] shadow-purple-glow">
        {/* Loader Overlays */}
        {isLoading && !hasError && <PlayerLoader />}

        {/* Error Overlay */}
        {hasError && (
          <PlayerError onRetry={handleRetry} onBackToMovie={onBackToMovie} />
        )}

        {/* The iframe player */}
        {!hasError && (
          <iframe
            key={`${tmdbId}-${activeServerId}-${key}`}
            title={`Stream Player - ${title} on ${activeServerId}`}
            src={embedUrl}
            className="absolute inset-0 w-full h-full border-0 z-10"
            allowFullScreen
            loading="lazy"
            onLoad={handleLoad}
            referrerPolicy="no-referrer"
            allow="autoplay; encrypted-media"
          />
        )}
      </div>
    </div>
  );
};
