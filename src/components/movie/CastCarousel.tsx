import * as React from 'react';
import { motion } from 'motion/react';
import { User, ChevronLeft, ChevronRight } from 'lucide-react';
import { movieService } from '../../services/movie.service';
import { tvService } from '../../services/tv.service';

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CastCarouselProps {
  movieId: string | number;
}

export const CastCarousel: React.FC<CastCarouselProps> = ({ movieId }) => {
  const [cast, setCast] = React.useState<CastMember[]>([]);
  const [loading, setLoading] = React.useState(true);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let active = true;
    const fetchCast = async () => {
      setLoading(true);
      try {
        const isTv = String(movieId).startsWith('tv-');
        const response = isTv 
          ? await tvService.getTVCredits(movieId)
          : await movieService.getMovieCredits(movieId);

        if (active) {
          // Keep a generous cast selection (e.g. up to 18 members) for an immersive slider experience
          setCast(response.cast ? response.cast.slice(0, 18) : []);
        }
      } catch (e) {
        console.warn('Failed to load movie cast:', e);
        if (active) setCast([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchCast();
    return () => {
      active = false;
    };
  }, [movieId]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = direction === 'left' ? -container.offsetWidth * 0.75 : container.offsetWidth * 0.75;
    container.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  // Skeletons during loading states
  if (loading) {
    return (
      <div className="space-y-6 pt-4 select-none">
        <div className="h-7 bg-white/[0.04] rounded-full w-48 animate-pulse" />
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-36 sm:w-44 flex flex-col gap-4 animate-pulse">
              <div className="w-full aspect-[2/3] bg-white/[0.03] border border-white/[0.04] rounded-[22px]" />
              <div className="h-4.5 bg-white/[0.05] rounded-full w-3/4 mx-auto" />
              <div className="h-3.5 bg-white/[0.03] rounded-full w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cast.length === 0) return null;

  // Clone cast members to support luxurious visual depth
  return (
    <div className="space-y-6 pt-4 relative group/carousel select-none">
      
      {/* Premium Section Title Row */}
      <div className="flex items-end justify-between">
        <div className="space-y-1.5 text-left">
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            <span>Cast & Crew</span>
            <span className="text-xs bg-primary/10 border border-primary/20 text-[#A855F7] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
              {cast.length} Headliners
            </span>
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary font-medium">
            Meet the talented ensemble behind the characters in this production.
          </p>
        </div>

        {/* Carousel slide controls (Only visible on hover/focus for clean desktop typography feel) */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="p-2.5 rounded-full bg-white/5 hover:bg-primary/20 hover:border-primary/40 border border-white/10 text-white transition-all cursor-pointer shadow-md backdrop-blur-md active:scale-90"
            aria-label="Scroll left"
            id="btn-cast-scroll-left"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-2.5 rounded-full bg-white/5 hover:bg-primary/20 hover:border-primary/40 border border-white/10 text-white transition-all cursor-pointer shadow-md backdrop-blur-md active:scale-90"
            aria-label="Scroll right"
            id="btn-cast-scroll-right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Slider Frame with Stagger Animations */}
      <div className="relative">
        <motion.div
          ref={scrollContainerRef}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.04,
              },
            },
          }}
          className="flex gap-5 overflow-x-auto pb-4 scroll-smooth scrollbar-thin scrollbar-thumb-white/10 hover:scrollbar-thumb-white/25 scrollbar-track-transparent -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {cast.map((actor, idx) => {
            const profileUrl = actor.profile_path 
              ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
              : null;

            return (
              <motion.div
                key={`${actor.id}-${idx}`}
                variants={{
                  hidden: { opacity: 0, y: 25, scale: 0.95 },
                  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
                }}
                whileHover={{ 
                  y: -6,
                  scale: 1.02,
                  backgroundColor: 'rgba(255, 255, 255, 0.06)',
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  boxShadow: '0 12px 30px -10px rgba(139, 92, 246, 0.15), 0 0 15px rgba(139, 92, 246, 0.1)',
                }}
                whileTap={{ scale: 0.96 }}
                className="flex-shrink-0 w-36 sm:w-44 group flex flex-col justify-between p-3 rounded-[24px] bg-[#13131A]/60 border border-white/[0.04] backdrop-blur-md transition-all duration-300 cursor-pointer select-none"
              >
                {/* Profile Photo Headshot container */}
                <div className="w-full aspect-[2/3] rounded-[18px] overflow-hidden bg-white/[0.01] border border-white/[0.05] relative mb-3.5 shadow-md">
                  {profileUrl ? (
                    <img
                      src={profileUrl}
                      alt={actor.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-primary/10 to-accent/5 text-text-muted">
                      <div className="h-12 w-12 rounded-full bg-white/[0.03] flex items-center justify-center mb-1.5 border border-white/5">
                        <User className="h-6 w-6 text-primary/50" />
                      </div>
                      <span className="text-[10px] uppercase font-extrabold tracking-widest opacity-60 text-center px-2">No Photo</span>
                    </div>
                  )}

                  {/* Gentle vignette hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>

                {/* Identity & Character Role details */}
                <div className="px-1.5 pb-1 text-center min-w-0">
                  <p className="text-xs sm:text-sm font-extrabold text-white truncate group-hover:text-[#A855F7] transition-colors leading-tight">
                    {actor.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#B3B3B8] font-medium truncate mt-1 leading-none">
                    {actor.character}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

    </div>
  );
};
