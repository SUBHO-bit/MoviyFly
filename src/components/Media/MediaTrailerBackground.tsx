import * as React from 'react';

interface MediaTrailerBackgroundProps {
  videoKey: string | null;
  backdropUrl: string;
  title: string;
  isMuted: boolean;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  onIframeLoad: () => void;
  backdropY: number;
  backdropScale: number;
  backdropOpacity: number;
}

export const MediaTrailerBackground: React.FC<MediaTrailerBackgroundProps> = ({
  videoKey,
  backdropUrl,
  title,
  isMuted,
  iframeRef,
  onIframeLoad,
  backdropY,
  backdropScale,
  backdropOpacity,
}) => {
  return (
    <div 
      className="absolute inset-0 z-0 pointer-events-none select-none transition-transform duration-100 ease-out"
      style={{
        transform: `translateY(${backdropY}px) scale(${backdropScale})`,
        opacity: backdropOpacity,
      }}
    >
      {videoKey ? (
        <div className="absolute inset-0 w-full h-full overflow-hidden animate-fade-in">
          <iframe
            ref={iframeRef}
            onLoad={onIframeLoad}
            title="Cinematic Background Video Trailer"
            src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=${isMuted ? 1 : 0}&loop=1&playlist=${videoKey}&controls=0&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&fs=0&disablekb=1&enablejsapi=1&origin=${window.location.origin}&vq=hd1080`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-[177.77777778vh] h-[56.25vw] pointer-events-none opacity-[0.92] scale-[1.35] object-cover"
            allow="autoplay; encrypted-media"
            style={{ 
              border: 'none', 
              pointerEvents: 'none',
              filter: 'contrast(1.18) saturate(1.28) brightness(1.2)' 
            }}
          />
        </div>
      ) : backdropUrl ? (
        <img
          src={backdropUrl}
          alt={title || 'Media Backdrop'}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-90 object-top"
          style={{
            filter: 'contrast(1.18) saturate(1.28) brightness(1.18)'
          }}
        />
      ) : (
        <div className="w-full h-full bg-[#0B0B10]" />
      )}

      {/* Cinematic soft gradient overlay mask */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.08) 50%, rgba(11, 11, 16, 0.85) 90%, #0B0B10 100%)'
        }}
      >
        {/* Subtle horizontal gradient to ensure readability on the far left without washing out the center */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to right, rgba(0, 0, 0, 0.22) 0%, rgba(0, 0, 0, 0.08) 40%, transparent 100%)'
          }}
        />
      </div>
    </div>
  );
};
