import * as React from 'react';
import { PlayerLoader } from './PlayerLoader';
import { PlayerError } from './PlayerError';
import { StreamingProvider } from './StreamingProvider';

interface MoviePlayerProps {
  tmdbId: string;
  title: string;
  activeServerId: string;
  onBackToMovie: () => void;
}

export const MoviePlayer: React.FC<MoviePlayerProps> = ({
  tmdbId,
  title,
  activeServerId,
  onBackToMovie,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasError, setHasError] = React.useState(false);
  const [key, setKey] = React.useState(0);

  // When tmdbId or activeServerId changes, reset states to show loader
  React.useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [tmdbId, activeServerId, key]);

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
