import * as React from 'react';
import { PlayerLoader } from './PlayerLoader';
import { PlayerError } from './PlayerError';
import { StreamingProvider } from './StreamingProvider';
import { ContinueWatchingManager } from './ContinueWatchingManager';
import { TMDBTVDetails } from '../../types/tv';
import { MovieData } from '../movie/MovieCard';
import { getBackdropUrl, getPosterUrl } from '../../config/tmdb';

interface TVPlayerProps {
  tmdbId: string;
  season: number;
  episode: number;
  title: string;
  activeServerId: string;
  onBackToTVShow: () => void;
  onServerChange?: (serverId: string) => void;
  tvShowDetails?: TMDBTVDetails | null;
}

export const TVPlayer: React.FC<TVPlayerProps> = ({
  tmdbId,
  season,
  episode,
  title,
  activeServerId,
  onBackToTVShow,
  onServerChange,
  tvShowDetails,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [key, setKey] = React.useState(0);

  // When stream parameters change, show loading overlay again
  React.useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [tmdbId, season, episode, activeServerId, key]);

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
        console.warn('[Viduki TV Player] All servers failed. Auto switching to next server...');
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
        const sNum = parsedData?.season || season || 1;
        const eNum = parsedData?.episode || episode || 1;

        // Save progress using existing manager
        ContinueWatchingManager.saveProgress(cleanId, sNum, eNum);

        try {
          const stored = localStorage.getItem('moviyfly_continue_watching');
          const existing: MovieData[] = stored ? JSON.parse(stored) : [];
          const itemId = `tv-${cleanId}`;

          const existingIdx = existing.findIndex((m) => m.id === itemId || m.id === cleanId);

          const poster = tvShowDetails?.poster_path
            ? getPosterUrl(tvShowDetails.poster_path)
            : parsedData?.poster || '';
          const backdrop = tvShowDetails?.backdrop_path
            ? getBackdropUrl(tvShowDetails.backdrop_path)
            : parsedData?.backdrop || '';
          const showTitle = tvShowDetails?.name || title || parsedData?.title || 'TV Show';
          const releaseYear = tvShowDetails?.first_air_date
            ? tvShowDetails.first_air_date.split('-')[0]
            : parsedData?.year || new Date().getFullYear();

          const tvItem: MovieData = {
            id: itemId,
            title: `${showTitle} S${sNum}:E${eNum}`,
            overview: tvShowDetails?.overview || parsedData?.overview || '',
            genres: tvShowDetails?.genres ? tvShowDetails.genres.map((g: any) => g.name) : [],
            rating: tvShowDetails?.vote_average ? tvShowDetails.vote_average.toFixed(1) : '0.0',
            year: releaseYear,
            runtime: `S${sNum} E${eNum}`,
            language: tvShowDetails?.original_language?.toUpperCase() || 'EN',
            ageRating: 'TV-14',
            poster: poster,
            backdrop: backdrop,
          };

          if (existingIdx >= 0) {
            existing[existingIdx] = { ...existing[existingIdx], ...tvItem };
          } else {
            existing.unshift(tvItem);
          }

          localStorage.setItem('moviyfly_continue_watching', JSON.stringify(existing.slice(0, 20)));
        } catch (err) {
          console.error('Failed to save TV show to Continue Watching:', err);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [activeServerId, tmdbId, season, episode, title, tvShowDetails, onServerChange]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleRetry = () => {
    setKey((prev) => prev + 1);
  };

  const embedUrl = StreamingProvider.getStreamUrl(activeServerId, tmdbId, 'tv', season, episode);

  return (
    <div className="w-full max-w-5xl mx-auto" id="watch-tv-player-wrapper">
      {/* 16:9 Aspect Ratio Container with no layout shift */}
      <div className="relative w-full aspect-video rounded-[24px] md:rounded-[32px] overflow-hidden bg-black border border-white/[0.06] shadow-purple-glow">
        {/* Loader Overlays */}
        {isLoading && !hasError && <PlayerLoader />}

        {/* Error Overlay */}
        {hasError && (
          <PlayerError onRetry={handleRetry} onBackToMovie={onBackToTVShow} />
        )}

        {/* The iframe player */}
        {!hasError && (
          <iframe
            key={`${tmdbId}-${season}-${episode}-${activeServerId}-${key}`}
            title={`TV Stream Player - ${title} S${season}E${episode} on ${activeServerId}`}
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

