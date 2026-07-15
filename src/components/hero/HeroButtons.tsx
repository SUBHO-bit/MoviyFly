import * as React from 'react';
import { Play, Info, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface HeroButtonsProps {
  onWatchNow?: () => void;
  onMoreDetails?: () => void;
  onToggleWatchlist?: () => void;
  isInWatchlist?: boolean;
  className?: string;
}

export const HeroButtons: React.FC<HeroButtonsProps> = ({
  onWatchNow,
  onMoreDetails,
  onToggleWatchlist,
  isInWatchlist = false,
  className,
}) => {
  const [watchlistHovered, setWatchlistHovered] = React.useState(false);

  return (
    <div className={cn('flex flex-wrap items-center gap-4 sm:gap-5', className)}>
      {/* Play Button - Purple, rounded, large, solid style */}
      <motion.button
        onClick={onWatchNow}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="h-14 px-8 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold flex items-center justify-center gap-2.5 transition-colors duration-200 cursor-pointer shadow-lg outline-none focus:ring-2 focus:ring-[#7C3AED]/40 text-base"
        aria-label="Watch movie now"
      >
        <Play className="h-5 w-5 fill-white text-white ml-0.5" strokeWidth={1.5} />
        <span>Watch Now</span>
      </motion.button>

      {/* Info Button - Dark, border, minimal */}
      <motion.button
        onClick={onMoreDetails}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="h-14 px-7 rounded-2xl bg-[#17171C]/80 hover:bg-[#27272A]/80 border border-white/[0.06] text-white font-semibold flex items-center justify-center gap-2.5 transition-colors duration-200 cursor-pointer outline-none focus:ring-1 focus:ring-white/20 text-base"
        aria-label="View movie details"
      >
        <Info className="h-5 w-5 text-text-secondary group-hover:text-white" strokeWidth={1.5} />
        <span className="text-text-secondary hover:text-white transition-colors">More Details</span>
      </motion.button>

      {/* Watchlist Toggle - Minimal round icon button */}
      <motion.button
        onClick={onToggleWatchlist}
        onMouseEnter={() => setWatchlistHovered(true)}
        onMouseLeave={() => setWatchlistHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'h-14 w-14 rounded-2xl flex items-center justify-center border transition-all duration-200 cursor-pointer outline-none focus:ring-1 focus:ring-white/20',
          isInWatchlist
            ? 'bg-[#7C3AED]/10 border-[#7C3AED]/40 text-[#A78BFA]'
            : 'bg-[#17171C]/80 border-white/[0.06] text-text-secondary hover:text-white hover:bg-[#27272A]/80'
        )}
        aria-label={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
      >
        <Heart
          className={cn(
            'h-5 w-5 transition-colors duration-200',
            isInWatchlist ? 'fill-[#A78BFA] text-[#A78BFA]' : 'text-current'
          )}
          strokeWidth={1.5}
        />
      </motion.button>
    </div>
  );
};
