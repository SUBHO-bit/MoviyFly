import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Heart, Share2, Star, Clock, X, Film, Volume2, VolumeX } from 'lucide-react';
import { TMDBMovieDetails } from '../../types/movie';
import { getBackdropUrl, getPosterUrl, TMDB_CONFIG } from '../../config/tmdb';
import { movieService } from '../../services/movie.service';
import { tvService } from '../../services/tv.service';
import { fetchFromTMDB } from '../../lib/api/tmdb';

interface MovieDetailsHeroProps {
  movie: TMDBMovieDetails;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
  onWatchNow: () => void;
}

export const MovieDetailsHero: React.FC<MovieDetailsHeroProps> = ({
  movie,
  isInWatchlist,
  onToggleWatchlist,
  onWatchNow,
}) => {
  const [copied, setCopied] = React.useState(false);
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
        const idStr = String(movie.id);
        const isTv = idStr.startsWith('tv-') || (movie as any).isTv;
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
        console.warn('Failed to load movie background trailer:', e);
        if (active) setVideoKey(null);
      }
    };

    fetchVideos();
    return () => {
      active = false;
    };
  }, [movie.id]);

  // Fetch official logo from TMDB
  React.useEffect(() => {
    let isMounted = true;
    const fetchLogo = async () => {
      try {
        const cleanId = String(movie.id).replace('movie-', '').replace('tv-', '');
        const isTv = String(movie.id).startsWith('tv-') || (movie as any).isTv;
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
            setLogoUrl(`${TMDB_CONFIG.IMAGE_BASE_URL}/original${selectedLogo.file_path}`);
          } else if (isMounted) {
            setLogoUrl(null);
          }
        } else if (isMounted) {
          setLogoUrl(null);
        }
      } catch (err) {
        console.warn('Failed to fetch movie logo:', err);
        if (isMounted) setLogoUrl(null);
      }
    };

    fetchLogo();
    return () => {
      isMounted = false;
    };
  }, [movie.id]);

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

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const posterUrl = getPosterUrl(movie.poster_path);
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

  // Format runtime gracefully
  let formattedRuntime = 'N/A';
  if ((movie as any).formattedRuntime) {
    formattedRuntime = (movie as any).formattedRuntime;
  } else if (movie.runtime) {
    const hours = Math.floor(movie.runtime / 60);
    const mins = movie.runtime % 60;
    formattedRuntime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  const ratingValue = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';
  const ageRating = (movie as any).ageRating || (movie.adult ? 'R' : 'PG-13');
  const status = movie.status || 'Released';
  const language = movie.original_language?.toUpperCase() || 'EN';

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
      {/* 1. Immersive Fullscreen Video Trailer background or Static Backdrop Parallax Frame */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none select-none transition-transform duration-100 ease-out"
        style={{
          transform: `translateY(${backdropY}px) scale(${backdropScale})`,
          opacity: backdropOpacity,
        }}
      >
        {videoKey && isIntersecting ? (
          <div className="absolute inset-0 w-full h-full overflow-hidden animate-fade-in">
            <iframe
              ref={iframeRef}
              onLoad={handleIframeLoad}
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
        ) : (
          <img
            src={backdropUrl}
            alt={movie.title || 'Movie Backdrop'}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-90 object-top"
            style={{
              filter: 'contrast(1.18) saturate(1.28) brightness(1.18)'
            }}
          />
        )}

        {/* 2. Premium soft cinematic gradient overlay mask */}
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

      {/* 3. Side-by-side content layout: Poster on left, movie logo & info beside it on right */}
      <div 
        className="relative z-20 pt-44 pb-20 px-6 md:pl-[4%] md:pr-12 lg:pl-[5%] lg:pr-16 w-full transition-transform duration-100 ease-out flex-grow flex items-end select-text"
        style={{
          transform: `translateY(${contentY}px)`,
          opacity: contentOpacity,
        }}
      >
        <div className="flex flex-col md:flex-row items-end gap-6 md:gap-14 lg:gap-20 w-full max-w-[1360px] mx-auto">
          
          {/* Movie Poster Card (Left side) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:block w-[220px] shrink-0 aspect-[2/3] rounded-[24px] overflow-hidden bg-card border border-white/[0.06] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] hover:shadow-[0_20px_45px_rgba(139,92,246,0.25)] hover:border-primary/40 transition-all duration-500 group cursor-pointer select-none mb-1 relative"
          >
            <img
              src={posterUrl}
              alt={movie.title || 'Movie Poster'}
              referrerPolicy="no-referrer"
              loading="eager"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            {/* Cinematic Movie Title Overlay directly on the movie poster */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent flex flex-col justify-end p-4 pb-5">
              <span className="text-white text-center text-[11px] sm:text-xs font-black uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] leading-tight font-sans">
                {movie.title}
              </span>
            </div>
          </motion.div>

          {/* Details & Information Block (Right side) */}
          <div className="flex flex-col gap-5 w-full md:max-w-[65%] lg:max-w-[55%] xl:max-w-[50%]">
            
            {/* Metadata Badges Row */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#A1A1AA] select-none">
              
              {/* IMDb Rating Badge */}
              <div className="flex items-center gap-1 bg-[#F5C518]/15 text-[#F5C518] px-3 py-1 rounded-full border border-[#F5C518]/25 shadow-[0_4px_12px_rgba(245,197,24,0.08)] backdrop-blur-md">
                <Star className="h-3 w-3 fill-[#F5C518] stroke-[#F5C518]" />
                <span>{ratingValue} IMDb</span>
              </div>

              {/* Release Year */}
              <div className="bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                <span>{releaseYear}</span>
              </div>

              {/* Runtime */}
              <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
                <Clock className="h-3 w-3" />
                <span>{formattedRuntime}</span>
              </div>

              {/* Age Rating */}
              <div className="bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md uppercase tracking-wide">
                <span>{ageRating}</span>
              </div>

              {/* Original Language */}
              <div className="bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md uppercase">
                <span>{language}</span>
              </div>

              {/* Release Status */}
              {movie.status && (
                <div className="bg-primary/15 text-[#A855F7] px-3 py-1 rounded-full border border-primary/25 backdrop-blur-md">
                  <span>{status}</span>
                </div>
              )}
            </div>

            {/* Movie Title (Official TMDB Logo Image or Typographic Fallback) */}
            <div className="space-y-2">
              {logoUrl ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                  className="h-16 sm:h-20 md:h-24 lg:h-28 xl:h-32 w-auto flex items-end justify-start select-none drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)]"
                >
                  <img
                    src={logoUrl}
                    alt={movie.title || 'Movie Logo'}
                    className="max-h-full w-auto object-contain object-left filter brightness-110 contrast-110"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              ) : (
                <motion.h1
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.05] drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)] font-sans"
                >
                  {movie.title}
                </motion.h1>
              )}
              
              {movie.tagline && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
                  className="text-sm sm:text-base md:text-lg font-serif italic text-purple-400/90 tracking-wide max-w-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                >
                  "{movie.tagline}"
                </motion.p>
              )}
            </div>

            {/* Genres Pills Row */}
            <div className="flex flex-wrap gap-1.5 select-none">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.06] text-[#D1D1D6] border border-white/[0.08] hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 backdrop-blur-md"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Core Overview text with line-height and premium readability */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
              className="text-xs sm:text-sm md:text-base text-[#E4E4E7] leading-relaxed max-w-full font-normal tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] opacity-[0.95]"
            >
              {movie.overview || 'No description is available for this title.'}
            </motion.p>

            {/* Premium glass-style actions: Watch Now, Wishlist, Share */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.42 }}
              className="flex flex-wrap items-center gap-3.5 pt-3 select-none"
            >
              {/* Watch Now Button */}
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 0 35px 10px rgba(139, 92, 246, 0.5)' }}
                whileTap={{ scale: 0.97 }}
                onClick={onWatchNow}
                className="flex items-center gap-3.5 px-8 py-3.5 rounded-full bg-[#8B5CF6] hover:bg-[#A855F7] text-white font-extrabold text-xs sm:text-sm shadow-[0_4px_25px_rgba(139, 92, 246, 0.35)] transition-all duration-300 cursor-pointer animate-fade-in"
                id="btn-watch-now"
              >
                <Play className="h-4.5 w-4.5 fill-white text-white animate-pulse" />
                <span>Watch Now</span>
              </motion.button>

              {/* Add to Wishlist Button */}
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}
                whileTap={{ scale: 0.93 }}
                onClick={onToggleWatchlist}
                className={`flex items-center justify-center p-3 rounded-full border transition-all cursor-pointer h-11 w-11 sm:h-12 sm:w-12 backdrop-blur-md ${
                  isInWatchlist
                    ? 'bg-red-500/20 border-red-500/50 text-red-500 hover:bg-red-500/30 shadow-[0_4px_20px_rgba(239,68,68,0.3)]'
                    : 'bg-white/10 border-white/10 text-white hover:bg-white/15'
                }`}
                title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                aria-label="Toggle watchlist"
                id="btn-toggle-watchlist"
              >
                <Heart className={`h-4.5 w-4.5 transition-transform duration-300 ${isInWatchlist ? 'fill-red-500 scale-110' : ''}`} />
              </motion.button>

              {/* Share Button */}
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderColor: 'rgba(139, 92, 246, 0.5)' }}
                whileTap={{ scale: 0.93 }}
                onClick={handleShare}
                className="flex items-center justify-center p-3 rounded-full bg-white/10 border border-white/10 text-white transition-all cursor-pointer h-11 w-11 sm:h-12 sm:w-12 relative backdrop-blur-md"
                title="Copy Link to Share"
                aria-label="Share movie link"
                id="btn-share-movie"
              >
                <Share2 className="h-4.5 w-4.5" />
                {copied && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white font-bold text-[10px] px-3.5 py-1.5 rounded-xl shadow-lg pointer-events-none whitespace-nowrap animate-fade-in border border-white/10 backdrop-blur-md">
                    Link Copied!
                  </span>
                )}
              </motion.button>
            </motion.div>

          </div>
        </div>
      </div>

      {/* 4. Floating Sound Toggle Button (Bottom-Right, glass style) */}
      {videoKey && (
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)' }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className="absolute bottom-16 right-4 md:right-[5%] lg:right-[6%] z-30 flex items-center justify-center w-11 h-11 rounded-full bg-black/40 border border-white/10 hover:border-primary/50 text-white shadow-lg cursor-pointer backdrop-blur-md transition-all duration-300"
          title={isMuted ? 'Unmute Trailer' : 'Mute Trailer'}
          id="btn-toggle-trailer-mute"
        >
          <div className="absolute inset-0 rounded-full bg-primary/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={isMuted ? 'muted' : 'unmuted'}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative z-10 flex items-center justify-center"
            >
              {isMuted ? (
                <VolumeX className="h-4.5 w-4.5 text-red-400" />
              ) : (
                <Volume2 className="h-4.5 w-4.5 text-purple-400" />
              )}
            </motion.div>
          </AnimatePresence>

          {/* Continuous premium ripple animation when unmuted */}
          <AnimatePresence>
            {!isMuted && (
              <motion.span 
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1.4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                className="absolute inset-0 rounded-full bg-primary/40 pointer-events-none"
              />
            )}
          </AnimatePresence>
        </motion.button>
      )}

    </div>
  );
};
