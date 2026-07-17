import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { HeroContent } from './HeroContent';
import { fetchFromTMDB } from '../../lib/api/tmdb';

export interface HeroSlideData {
  id: string;
  title: string;
  overview: string;
  genres: string[];
  rating: string | number;
  year: number | string;
  runtime: string;
  language: string;
  ageRating: string;
  backdrop: string;
  isTrending?: boolean;
}

export interface HeroSlideProps {
  movie: HeroSlideData;
  active: boolean;
  isNext?: boolean;
  isInWatchlist?: boolean;
  onWatchNow?: () => void;
  onMoreDetails?: () => void;
  onToggleWatchlist?: () => void;
  className?: string;
  collapsed?: boolean;
}

export const HeroSlide: React.FC<HeroSlideProps> = ({
  movie,
  active,
  isNext = false,
  isInWatchlist = false,
  onWatchNow,
  onMoreDetails,
  onToggleWatchlist,
  className,
  collapsed = false,
}) => {
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);
  const [hasFetched, setHasFetched] = React.useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  // Check prefers-reduced-motion for high-end accessibility compliance
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  // Lazy load TMDB official vector logos for active & next preloaded slides
  React.useEffect(() => {
    if ((active || isNext) && !hasFetched) {
      setHasFetched(true);
      const isTv = String(movie.id).startsWith('tv-');
      const cleanId = String(movie.id).replace('movie-', '').replace('tv-', '');

      // Fetch official high-quality logo image
      const imagesPath = isTv ? `/tv/${cleanId}/images` : `/movie/${cleanId}/images`;
      fetchFromTMDB<{ logos?: { file_path: string; iso_639_1?: string }[] }>(imagesPath, {
        include_image_language: 'en,null',
      })
        .then((res) => {
          if (res && res.logos && res.logos.length > 0) {
            // Find English logo if possible, otherwise first logo
            const englishLogo = res.logos.find((l) => l.iso_639_1 === 'en') || res.logos[0];
            if (englishLogo) {
              setLogoUrl(`https://image.tmdb.org/t/p/original${englishLogo.file_path}`);
            }
          }
        })
        .catch((err) => {
          console.warn(`Failed to fetch logo for ${movie.title}:`, err);
        });
    }
  }, [active, isNext, movie.id, hasFetched]);

  const shouldAnimateBackdrop = active && !prefersReducedMotion;

  return (
    <div
      className={cn(
        'absolute inset-0 w-full h-full select-none overflow-hidden transition-opacity duration-700 ease-in-out',
        active ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none',
        className
      )}
    >
      {/* Background Image with slow Ken-Burns zoom and pan effect */}
      <motion.img
        src={movie.backdrop}
        alt={movie.title}
        animate={shouldAnimateBackdrop ? {
          scale: [1, 1.08, 1],
          x: [0, 6, -6, 0],
          y: [0, -3, 3, 0]
        } : { scale: 1 }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute inset-0 w-full h-full object-cover object-center brightness-[0.85] contrast-[1.08] saturate-[1.05]"
        referrerPolicy="no-referrer"
        loading="eager"
        fetchPriority={active ? "high" : "low"}
        style={{
          objectPosition: 'center center',
          objectFit: 'cover'
        }}
      />

      {/* Cinematic Overlays (Only Two Overlays as requested) */}
      {/* 1. Overlay 1: Increase text readability */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'rgba(0, 0, 0, 0.18)'
        }}
      />

      {/* 2. Overlay 2: Natural fade into the content below */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(11, 11, 16, 0.88) 0%, rgba(11, 11, 16, 0.45) 18%, rgba(11, 11, 16, 0.12) 40%, transparent 70%)'
        }}
      />

      {/* Left-aligned Content Area: aligned to the bottom-left third with generous responsive padding */}
      <div className="absolute inset-0 z-20 flex items-end pb-8 sm:pb-10 md:pb-12 lg:pb-14 px-4 sm:px-8 md:px-16 lg:px-20 py-10 sm:py-14 transition-all duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="w-full"
        >
          <HeroContent
            title={movie.title}
            overview={movie.overview}
            genres={movie.genres}
            rating={movie.rating}
            year={movie.year}
            runtime={movie.runtime}
            language={movie.language}
            ageRating={movie.ageRating}
            isTrending={movie.isTrending}
            isInWatchlist={isInWatchlist}
            logoUrl={logoUrl}
            onWatchNow={onWatchNow}
            onMoreDetails={onMoreDetails}
            onToggleWatchlist={onToggleWatchlist}
          />
        </motion.div>
      </div>
    </div>
  );
};
