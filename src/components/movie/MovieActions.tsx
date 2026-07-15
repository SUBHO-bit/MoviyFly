import * as React from 'react';
import { Play, Plus, Check, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export interface MovieActionsProps {
  onPlay?: (e: React.MouseEvent) => void;
  onWatchlistToggle?: (e: React.MouseEvent) => void;
  onMoreInfo?: (e: React.MouseEvent) => void;
  isInWatchlist?: boolean;
  className?: string;
}

export const MovieActions: React.FC<MovieActionsProps> = ({
  onPlay,
  onWatchlistToggle,
  onMoreInfo,
  isInWatchlist = false,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2.5 justify-center', className)}>
      {/* Play Button */}
      <motion.button
        onClick={onPlay}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        className="h-10 w-10 rounded-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white flex items-center justify-center cursor-pointer shadow-lg outline-none focus:ring-2 focus:ring-[#7C3AED]/40 transition-colors"
        title="Play Now"
        aria-label="Play video"
      >
        <Play className="h-4.5 w-4.5 fill-white text-white ml-0.5" strokeWidth={1.5} />
      </motion.button>

      {/* Add / Check Watchlist Button */}
      <motion.button
        onClick={onWatchlistToggle}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        className={cn(
          'h-10 w-10 rounded-full flex items-center justify-center cursor-pointer border outline-none focus:ring-1 focus:ring-white/20 transition-all duration-200',
          isInWatchlist
            ? 'bg-[#7C3AED]/15 border-[#7C3AED]/35 text-[#A78BFA]'
            : 'bg-black/40 hover:bg-black/60 border-white/10 hover:border-white/20 text-white'
        )}
        title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        aria-label={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
      >
        {isInWatchlist ? (
          <Check className="h-4.5 w-4.5" strokeWidth={2} />
        ) : (
          <Plus className="h-4.5 w-4.5" strokeWidth={1.5} />
        )}
      </motion.button>

      {/* More Info Details Button */}
      <motion.button
        onClick={onMoreInfo}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        className="h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 border border-white/10 hover:border-white/20 text-white flex items-center justify-center cursor-pointer outline-none focus:ring-1 focus:ring-white/20 transition-all duration-200"
        title="More Info"
        aria-label="More Info details"
      >
        <Info className="h-4.5 w-4.5" strokeWidth={1.5} />
      </motion.button>
    </div>
  );
};
