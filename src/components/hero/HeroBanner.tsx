import * as React from 'react';
import { HeroSlide, HeroSlideData } from './HeroSlide';
import { CarouselControls } from './CarouselControls';
import { CarouselIndicators } from './CarouselIndicators';
import { cn } from '../../lib/utils';
import { navigate } from '../../lib/router';

import { MovieData } from '../movie/MovieCard';

// High-quality cinematic mock movie datasets
const FEATURED_MOVIES: HeroSlideData[] = [
  {
    id: 'dune-2',
    title: 'Dune: Part Two',
    overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    genres: ['Sci-Fi', 'Adventure', 'Drama'],
    rating: '8.6',
    year: 2024,
    runtime: '2h 46m',
    language: 'English',
    ageRating: 'PG-13',
    backdrop: 'https://images.unsplash.com/photo-1547483238-2cbf88bd1423?q=80&w=1600',
    isTrending: true,
  },
  {
    id: 'interstellar',
    title: 'Interstellar',
    overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    rating: '8.7',
    year: 2014,
    runtime: '2h 49m',
    language: 'English',
    ageRating: 'PG-13',
    backdrop: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?q=80&w=1600',
    isTrending: true,
  },
  {
    id: 'blade-runner-2049',
    title: 'Blade Runner 2049',
    overview: "A new blade runner, Los Angeles Police Department Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos. K's discovery leads him on a quest to find Rick Deckard, a former LAPD blade runner who has been missing for thirty years.",
    genres: ['Sci-Fi', 'Drama', 'Thriller'],
    rating: '8.0',
    year: 2017,
    runtime: '2h 44m',
    language: 'English',
    ageRating: 'R',
    backdrop: 'https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=1600',
    isTrending: false,
  },
  {
    id: 'spider-verse',
    title: 'Spider-Man: Into the Spider-Verse',
    overview: 'Teen Miles Morales becomes the Spider-Man of his universe and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.',
    genres: ['Animation', 'Action', 'Adventure'],
    rating: '8.4',
    year: 2018,
    runtime: '1h 57m',
    language: 'English',
    ageRating: 'PG',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1600',
    isTrending: true,
  },
  {
    id: 'dark-knight',
    title: 'The Dark Knight',
    overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    genres: ['Action', 'Crime', 'Drama'],
    rating: '9.0',
    year: 2008,
    runtime: '2h 32m',
    language: 'English',
    ageRating: 'PG-13',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1600',
    isTrending: false,
  }
];

export interface HeroBannerProps {
  movies?: MovieData[];
  collapsed?: boolean;
  autoRotateInterval?: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ movies, collapsed = false, autoRotateInterval = 9000 }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [watchlist, setWatchlist] = React.useState<Record<string, boolean>>({});

  // Smart backdrop filter & resolution verification
  const activeMovies = React.useMemo(() => {
    const list = movies && movies.length > 0 ? movies : FEATURED_MOVIES;
    
    // Automatically filter out placeholder, black, missing, or low quality backdrops
    const filtered = list.filter((m) => {
      if (!m.backdrop) return false;
      
      // Filter out typical generic unsplash fallback placeholder
      const isPlaceholder = m.backdrop.includes('photo-1547483238-2cbf88bd1423');
      if (isPlaceholder && m.id !== 'dune-2') return false; // allow high-quality custom mockup dune-2
      
      // Ensure the movie has a positive cinematic rating and description composition
      const isTooLowRating = parseFloat(String(m.rating)) < 5.0;
      if (isTooLowRating) return false;

      // Ensure description overview is cinematic and complete
      const hasPoorOverview = !m.overview || m.overview.length < 20;
      if (hasPoorOverview) return false;

      return true;
    });

    // Fall back to original list if filter was too aggressive
    const finalMovies = filtered.length > 0 ? filtered : list;

    return finalMovies.slice(0, 5).map(m => ({
      ...m,
      isTrending: m.isTrending !== undefined ? m.isTrending : true
    }));
  }, [movies]);

  const handlePrev = React.useCallback(() => {
    if (activeMovies.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + activeMovies.length) % activeMovies.length);
  }, [activeMovies.length]);

  const handleNext = React.useCallback(() => {
    if (activeMovies.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activeMovies.length);
  }, [activeMovies.length]);

  // Premium Automatic Carousel Rotation (default every 9 seconds)
  React.useEffect(() => {
    if (activeMovies.length === 0 || isHovered) return;

    const interval = setInterval(() => {
      handleNext();
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [activeMovies.length, isHovered, handleNext, autoRotateInterval]);

  // Dynamic image preloading to cache current and next slide backdrops before transitions
  React.useEffect(() => {
    if (activeMovies.length === 0) return;
    
    // Preload current image
    const currentMovie = activeMovies[currentIndex];
    if (currentMovie && currentMovie.backdrop) {
      const imgCurrent = new Image();
      imgCurrent.src = currentMovie.backdrop;
    }

    // Preload next image
    const nextIndex = (currentIndex + 1) % activeMovies.length;
    const nextMovie = activeMovies[nextIndex];
    if (nextMovie && nextMovie.backdrop) {
      const imgNext = new Image();
      imgNext.src = nextMovie.backdrop;
    }
  }, [currentIndex, activeMovies]);

  const handleToggleWatchlist = (id: string) => {
    setWatchlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Keyboard navigation logic
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    }
  };

  if (activeMovies.length === 0) return null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className="relative w-full h-screen min-h-[600px] lg:min-h-[750px] bg-[#0B0B10] overflow-hidden select-none outline-none"
      aria-label="Featured content carousel"
    >
      {/* Active Movie Slide Elements */}
      {activeMovies.map((movie, index) => {
        const isActive = currentIndex === index;
        const isNext = (currentIndex + 1) % activeMovies.length === index;
        return (
          <HeroSlide
            key={movie.id}
            movie={movie}
            active={isActive}
            isNext={isNext}
            isInWatchlist={!!watchlist[movie.id]}
            onWatchNow={() => {
              if (String(movie.id).startsWith('tv-')) {
                navigate(`/tv/${movie.id}`);
              } else {
                navigate(`/movie/${movie.id}`);
              }
            }}
            onMoreDetails={() => {
              if (String(movie.id).startsWith('tv-')) {
                navigate(`/tv/${movie.id}`);
              } else {
                navigate(`/movie/${movie.id}`);
              }
            }}
            onToggleWatchlist={() => handleToggleWatchlist(movie.id)}
            collapsed={collapsed}
          />
        );
      })}

      {/* Floating Carousel Controls & Slide Indicators */}
      <div className="absolute bottom-6 right-8 z-30 flex items-center gap-6 select-none bg-[#0B0B0F]/45 backdrop-blur-sm px-4 py-2.5 rounded-full border border-white/[0.04] max-sm:hidden">
        {/* Step Indicators */}
        <CarouselIndicators
          total={activeMovies.length}
          current={currentIndex}
          onChange={setCurrentIndex}
        />

        {/* Separator Line */}
        <div className="w-px h-4 bg-white/10" />

        {/* Action Controls */}
        <CarouselControls onPrev={handlePrev} onNext={handleNext} />
      </div>

      {/* Simplified Indicator Layout for Mobile/Touch viewports */}
      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center sm:hidden">
        <CarouselIndicators
          total={activeMovies.length}
          current={currentIndex}
          onChange={setCurrentIndex}
        />
      </div>
    </div>
  );
};
