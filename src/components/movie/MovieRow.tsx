import * as React from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { MovieCard, MovieData } from './MovieCard';

export interface MovieRowProps {
  title: string;
  movies?: MovieData[];
  fetchData?: () => Promise<MovieData[]>;
  onPlayMovie?: (movie: MovieData) => void;
  onMoreInfo?: (movie: MovieData) => void;
  onToggleWatchlist?: (movie: MovieData) => void;
  watchlist?: Record<string, boolean>;
  onSeeAll?: () => void;
  className?: string;
  hideHeader?: boolean;
}

export const MovieRow = React.memo<MovieRowProps>(({
  title,
  movies,
  fetchData,
  onPlayMovie,
  onMoreInfo,
  onToggleWatchlist,
  watchlist = {},
  onSeeAll,
  className,
  hideHeader = false,
}) => {
  const rowRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isIntersected, setIsIntersected] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [localMovies, setLocalMovies] = React.useState<MovieData[]>(movies || []);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);

  // Drag-to-scroll states
  const [isDown, setIsDown] = React.useState(false);
  const [startX, setStartX] = React.useState(0);
  const [scrollLeftState, setScrollLeftState] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);

  // Sync prop movies to localMovies
  React.useEffect(() => {
    if (movies) {
      setLocalMovies(movies);
    }
  }, [movies]);

  // Intersection observer to lazy render movie rows when scrolling close to viewport
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersected(true);
          observer.disconnect();

          if (fetchData && localMovies.length === 0) {
            setLoading(true);
            fetchData()
              .then((data) => {
                setLocalMovies(data);
                setLoading(false);
              })
              .catch((err) => {
                console.error(`Failed to fetch lazy row data for ${title}:`, err);
                setLoading(false);
              });
          }
        }
      },
      { rootMargin: '450px 0px' } // Pre-render 450px before scrolling into view
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [fetchData, localMovies.length, title]);

  const checkScrollPosition = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 5);
      // Give a tiny tolerance of 5px for sub-pixel zoom rendering
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  React.useEffect(() => {
    if (!isIntersected) return;
    const el = rowRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollPosition);
      // Initial check
      checkScrollPosition();
      // Handle resize trigger
      window.addEventListener('resize', checkScrollPosition);
    }
    return () => {
      if (el) {
        el.removeEventListener('scroll', checkScrollPosition);
      }
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [movies, isIntersected]);

  // Horizontal mouse scroll wheel assistant
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (rowRef.current) {
      // If the scroll is vertical, translate it to horizontal
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        rowRef.current.scrollLeft += e.deltaY;
      }
    }
  };

  // Drag-to-scroll handling
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rowRef.current) return;
    setIsDown(true);
    setIsDragging(false);
    setStartX(e.pageX - rowRef.current.offsetLeft);
    setScrollLeftState(rowRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
    // Slight delay to prevent trigger click if dragging
    setTimeout(() => {
      setIsDragging(false);
    }, 50);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown || !rowRef.current) return;
    e.preventDefault();
    const x = e.pageX - rowRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed scaling factor
    if (Math.abs(walk) > 5) {
      setIsDragging(true);
    }
    rowRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Button scroll trigger actions (scrolls roughly one viewport width minus 1 card offset)
  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { clientWidth } = rowRef.current;
      const scrollOffset = clientWidth * 0.8;
      rowRef.current.scrollTo({
        left: rowRef.current.scrollLeft + (direction === 'left' ? -scrollOffset : scrollOffset),
        behavior: 'smooth',
      });
    }
  };

  const showSkeleton = !isIntersected || loading || localMovies.length === 0;

  if (showSkeleton) {
    return (
      <div ref={containerRef} className={cn('flex flex-col gap-3 h-[310px] sm:h-[360px] md:h-[390px] justify-center', className)}>
        {!hideHeader && (
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="h-5.5 w-1.5 rounded bg-[#7C3AED]/20 animate-pulse" />
              <div className="h-6 w-48 bg-white/5 rounded animate-pulse" />
            </div>
          </div>
        )}
        <div className="flex gap-5 md:gap-6 overflow-hidden py-1.5 px-1.5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="w-[170px] sm:w-[210px] md:w-[230px] h-[210px] sm:h-[260px] md:h-[290px] shrink-0 bg-white/[0.01] border border-white/[0.04] rounded-[24px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn('relative group/row flex flex-col gap-3 select-none', className)}>
      {/* Header of the Row */}
      {!hideHeader && (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <div className="h-5.5 w-1.5 rounded bg-[#7C3AED]" />
            <h3 className="text-lg sm:text-xl md:text-[28px] font-extrabold text-white tracking-tight uppercase leading-none">
              {title}
            </h3>
          </div>

          {onSeeAll && (
            <button
              onClick={onSeeAll}
              className="flex items-center gap-1.5 text-xs font-bold text-[#B3B3B8] hover:text-[#7C3AED] transition-colors cursor-pointer select-none outline-none group/btn"
            >
              <span>See All</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-250 group-hover/btn:translate-x-1" strokeWidth={2} />
            </button>
          )}
        </div>
      )}

      {/* Row Scroll View wrapper */}
      <div className="relative w-full">
        {/* Left Arrow button */}
        {showLeftArrow && (
          <button
            onClick={() => handleScroll('left')}
            className="absolute left-1 z-30 top-[105px] sm:top-[130px] md:top-[145px] -translate-y-1/2 h-11 w-11 rounded-full bg-black/80 border border-white/10 hover:border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 cursor-pointer opacity-0 group-hover/row:opacity-100 outline-none shadow-lg"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
          </button>
        )}

        {/* Right Arrow button */}
        {showRightArrow && (
          <button
            onClick={() => handleScroll('right')}
            className="absolute right-1 z-30 top-[105px] sm:top-[130px] md:top-[145px] -translate-y-1/2 h-11 w-11 rounded-full bg-black/80 border border-white/10 hover:border-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all duration-200 cursor-pointer opacity-0 group-hover/row:opacity-100 outline-none shadow-lg"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
          </button>
        )}

        {/* Horizontally scrollable content container */}
        <div
          ref={rowRef}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={cn(
            'flex gap-5 md:gap-6 overflow-x-auto pb-5 pt-1.5 px-1.5 custom-scroll-area cursor-grab select-none scroll-smooth',
            isDown ? 'cursor-grabbing scroll-auto' : ''
          )}
          style={{ scrollbarWidth: 'none' }}
        >
          {localMovies.map((movie) => {
            const movieIdStr = String(movie.id);
            const rawId = movieIdStr.replace('movie-', '').replace('tv-', '');
            const isInWatchlist = !!(
              watchlist[movieIdStr] ||
              watchlist[rawId] ||
              watchlist[`movie-${rawId}`] ||
              watchlist[`tv-${rawId}`]
            );
            return (
              <div
                key={movie.id}
                className="w-[170px] sm:w-[210px] md:w-[230px] shrink-0"
                style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
              >
                <MovieCard
                  movie={movie}
                  isInWatchlist={isInWatchlist}
                  onPlay={onPlayMovie}
                  onMoreInfo={onMoreInfo}
                  onToggleWatchlist={onToggleWatchlist}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});
