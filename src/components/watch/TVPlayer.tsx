import * as React from 'react';
import { PlayerLoader } from './PlayerLoader';
import { PlayerError } from './PlayerError';
import { StreamingProvider } from './StreamingProvider';

interface TVPlayerProps {
  tmdbId: string;
  season: number;
  episode: number;
  title: string;
  activeServerId: string;
  onBackToTVShow: () => void;
}

export const TVPlayer: React.FC<TVPlayerProps> = ({
  tmdbId,
  season,
  episode,
  title,
  activeServerId,
  onBackToTVShow,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [key, setKey] = React.useState(0);

  // When stream parameters change, show loading overlay again
  React.useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [tmdbId, season, episode, activeServerId, key]);

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

