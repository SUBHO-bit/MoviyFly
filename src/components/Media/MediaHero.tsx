import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MediaItem } from '../../types/media';
import { MediaTrailerBackground } from './MediaTrailerBackground';
import { MediaPoster } from './MediaPoster';
import { MediaInfo } from './MediaInfo';
import { MediaButtons } from './MediaButtons';
import { MediaSoundToggle } from './MediaSoundToggle';
import { movieService } from '../../services/movie.service';
import { tvService } from '../../services/tv.service';
import { fetchFromTMDB } from '../../lib/api/tmdb';
import { TMDB_CONFIG, getLogoUrl } from '../../config/tmdb';

interface MediaHeroProps {
  media: MediaItem;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
  onWatchNow: () => void;
}

export const MediaHero: React.FC<MediaHeroProps> = ({
  media,
  isInWatchlist,
  onToggleWatchlist,
  onWatchNow,
}) => {
  const [videoKey, setVideoKey] = React.useState<string | null>(null);
  const [isIntersecting, setIsIntersecting] = React.useState(true);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);

  const heroRef = React.useRef<HTMLDivElement>(null);
  const iframeRef = React.useRef<HTMLIFrameElement>(null);

  const [isMuted, setIsMuted] = React.useState<boolean>(() => {
    const sessionMute = sessionStorage.getItem('movie_trailer_muted');
    return sessionMute !== 'false'; // Defaults to true
  });

  const sendMuteCommand = React.useCallback((muted: boolean) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const command = muted ? 'mute' : 'unMute';
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: command }),
        '*'
      );
    }
  }, []);

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    sessionStorage.setItem('movie_trailer_muted', String(newMuted));
    sendMuteCommand(newMuted);
  };

  const handleIframeLoad = () => {
    sendMuteCommand(isMuted);
  };

  // Sync mute state when video or visibility changes
  React.useEffect(() => {
    const timer = setTimeout(() => {
      sendMuteCommand(isMuted);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isMuted, videoKey, isIntersecting, sendMuteCommand]);

  // Monitor scrolling inside custom-scroll-area for elegant parallax scroll animations
  React.useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target && target.classList && target.classList.contains('custom-scroll-area')) {
        setScrollTop(target.scrollTop);
      }
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  // Monitor viewport intersection to pause/play background trailer
  React.useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch YouTube trailer
  React.useEffect(() => {
    let active = true;
    const fetchVideos = async () => {
      try {
        const idStr = String(media.id);
        const isTv = media.mediaType === 'tv' || idStr.startsWith('tv-') || (media as any).isTv;
        const rawId = idStr.replace('movie-', '').replace('tv-', '');
        
        const response = isTv 
          ? await tvService.getTVVideos(rawId)
          : await movieService.getMovieVideos(rawId);

        if (!active) return;
        
        const videos = response.results || [];
        // Priority: official trailer on YouTube -> any YouTube trailer -> teaser or clip
        const trailer = videos.find(
          (v: any) => v.site.toLowerCase() === 'youtube' && v.type.toLowerCase() === 'trailer' && v.official
        ) || videos.find(
          (v: any) => v.site.toLowerCase() === 'youtube' && v.type.toLowerCase() === 'trailer'
        ) || videos.find(
          (v: any) => v.site.toLowerCase() === 'youtube' && (v.type.toLowerCase() === 'teaser' || v.type.toLowerCase() === 'clip')
        );

        if (trailer) {
          setVideoKey(trailer.key);
        } else {
          setVideoKey(null);
        }
      } catch (e) {
        console.warn('Failed to load media background trailer:', e);
        if (active) setVideoKey(null);
      }
    };

    fetchVideos();
    return () => {
      active = false;
    };
  }, [media.id, media.mediaType]);

  // Fetch official logo from TMDB
  React.useEffect(() => {
    let isMounted = true;
    const fetchLogo = async () => {
      try {
        const cleanId = String(media.id).replace('movie-', '').replace('tv-', '');
        const isTv = media.mediaType === 'tv' || String(media.id).startsWith('tv-') || (media as any).isTv;
        const endpoint = isTv ? `/tv/${cleanId}/images` : `/movie/${cleanId}/images`;
        
        const data = await fetchFromTMDB<{ logos?: { file_path: string; iso_639_1: string | null; aspect_ratio: number }[] }>(endpoint);
        if (data && data.logos && data.logos.length > 0) {
          // Find English logos first
          const englishLogos = data.logos.filter(l => l.iso_639_1 === 'en');
          let selectedLogo = englishLogos[0];
          if (!selectedLogo) {
            selectedLogo = data.logos.find(l => !l.iso_639_1) || data.logos[0];
          }
          if (selectedLogo && isMounted) {
            setLogoUrl(getLogoUrl(selectedLogo.file_path));
          } else if (isMounted) {
            setLogoUrl(null);
          }
        } else if (isMounted) {
          setLogoUrl(null);
        }
      } catch (err) {
        console.warn('Failed to fetch media logo:', err);
        if (isMounted) setLogoUrl(null);
      }
    };

    fetchLogo();
    return () => {
      isMounted = false;
    };
  }, [media.id, media.mediaType]);

  // Listen for YouTube state change messages to loop the video infinitely
  React.useEffect(() => {
    const handleYoutubeMessage = (event: MessageEvent) => {
      try {
        if (!event.origin.includes('youtube.com')) return;
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        
        let state: number | null = null;
        if (data.event === 'onStateChange') {
          state = data.info;
        } else if (data.event === 'infoDelivery' && data.info && typeof data.info.playerState === 'number') {
          state = data.info.playerState;
        }

        // YT.PlayerState.ENDED is 0
        if (state === 0 && iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'seekTo', args: [0, true] }),
            '*'
          );
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo' }),
            '*'
          );
        }
      } catch (err) {
        // Ignore JSON parse errors for non-matching postMessages
      }
    };

    window.addEventListener('message', handleYoutubeMessage);
    return () => window.removeEventListener('message', handleYoutubeMessage);
  }, [videoKey]);

  const releaseYear = media.releaseDate ? media.releaseDate.split('-')[0] : 'N/A';

  // Compute scroll-based parallax transformation states
  const backdropY = Math.min(scrollTop * 0.35, 180);
  const backdropOpacity = Math.max(1 - scrollTop / 500, 0);
  const backdropScale = 1 + Math.min(scrollTop / 1200, 0.08);
  const contentY = -Math.min(scrollTop * 0.15, 70);
  const contentOpacity = Math.max(1 - scrollTop / 400, 0.15);

  return (
    <div 
      ref={heroRef}
      className="relative w-full h-screen min-h-[650px] overflow-hidden bg-[#0B0B10] flex flex-col justify-end rounded-none shadow-none border-none"
    >
      {/* 1. Video Trailer background or Static Backdrop */}
      <MediaTrailerBackground
        videoKey={videoKey && isIntersecting ? videoKey : null}
        backdropUrl={media.backdrop}
        title={media.title}
        isMuted={isMuted}
        iframeRef={iframeRef}
        onIframeLoad={handleIframeLoad}
        backdropY={backdropY}
        backdropScale={backdropScale}
        backdropOpacity={backdropOpacity}
      />

      {/* 2. Content layout */}
      <div 
        className="relative z-20 pt-44 pb-20 px-6 md:pl-[4%] md:pr-12 lg:pl-[5%] lg:pr-16 w-full transition-transform duration-100 ease-out flex-grow flex items-end select-text"
        style={{
          transform: `translateY(${contentY}px)`,
          opacity: contentOpacity,
        }}
      >
        <div className="flex flex-col md:flex-row items-end gap-6 md:gap-14 lg:gap-20 w-full max-w-[1360px] mx-auto">
          
          {/* Floating Poster on left */}
          <MediaPoster
            title={media.title}
            posterUrl={media.poster}
          />

          {/* Details & Information on right */}
          <div className="flex flex-col gap-5 w-full md:max-w-[65%] lg:max-w-[55%] xl:max-w-[50%]">
            <MediaInfo
              id={media.id}
              title={media.title}
              logoUrl={logoUrl}
              tagline={media.tagline}
              genres={media.genres}
              overview={media.overview}
              rating={media.rating}
              releaseYear={releaseYear}
              runtime={media.runtime}
              ageRating={media.ageRating || 'PG-13'}
              language={media.language}
              status={media.status}
            />

            <MediaButtons
              isInWatchlist={isInWatchlist}
              onToggleWatchlist={onToggleWatchlist}
              onWatchNow={onWatchNow}
            />
          </div>

        </div>
      </div>

      {/* 3. Floating Sound Toggle Button */}
      {videoKey && (
        <MediaSoundToggle
          isMuted={isMuted}
          onToggleMute={toggleMute}
        />
      )}
    </div>
  );
};
