import * as React from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { RatingBadge } from './RatingBadge';
import { MovieActions } from './MovieActions';

export interface MoviePosterProps {
  title: string;
  posterUrl: string;
  rating: string | number;
  isInWatchlist?: boolean;
  onPlay?: (e: React.MouseEvent) => void;
  onWatchlistToggle?: (e: React.MouseEvent) => void;
  onMoreInfo?: (e: React.MouseEvent) => void;
  className?: string;
}

export const MoviePoster: React.FC<MoviePosterProps> = ({
  title,
  posterUrl,
  rating,
  isInWatchlist = false,
  onPlay,
  onWatchlistToggle,
  onMoreInfo,
  className,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  return (
    <div
      className={cn(
        'relative h-[210px] sm:h-[260px] md:h-[290px] w-full rounded-[20px] overflow-hidden bg-[#18181C] border border-white/[0.06] select-none group/poster',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background/Placeholder visual while the image loads */}
      <div className={cn(
        "absolute inset-0 bg-white/[0.02] animate-pulse transition-opacity duration-500",
        loaded ? "opacity-0 pointer-events-none" : "opacity-100"
      )} />

      {/* Actual Movie Poster Artwork */}
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={`${title} Poster`}
          className={cn(
            "w-full h-full object-cover select-none transition-all duration-500 ease-out group-hover/poster:scale-[1.03]",
            loaded ? "blur-0 scale-100 opacity-100" : "blur-sm scale-[0.98] opacity-0"
          )}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          width={342}
          height={513}
          onLoad={() => setLoaded(true)}
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#1A1A22] to-[#13131A] flex items-center justify-center border border-white/5">
          <span className="text-xs text-text-muted font-bold text-center px-4">No Image Available</span>
        </div>
      )}

      {/* Persistent floating IMDb Rating Badge (Top-Left overlay) */}
      <div className="absolute top-3 left-3 z-20 pointer-events-none transition-opacity duration-200 group-hover/poster:opacity-0">
        <RatingBadge rating={rating} />
      </div>

      {/* Hover Overlay: Dark gradient from bottom/center up, Play controls, etc */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/30 z-10 flex flex-col justify-end items-center p-4 transition-opacity duration-250 ease-out',
          isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Play & Interactive controls container */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full text-center pb-4"
        >
          <MovieActions
            onPlay={onPlay}
            onWatchlistToggle={onWatchlistToggle}
            onMoreInfo={onMoreInfo}
            isInWatchlist={isInWatchlist}
          />
        </motion.div>
      </div>
    </div>
  );
};
