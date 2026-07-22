import * as React from 'react';
import { motion } from 'motion/react';

interface MediaPosterProps {
  title: string;
  posterUrl: string;
}

export const MediaPoster: React.FC<MediaPosterProps> = ({ title, posterUrl }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="hidden md:block w-[220px] shrink-0 aspect-[2/3] rounded-[24px] overflow-hidden bg-card border border-white/[0.06] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] hover:shadow-[0_20px_45px_rgba(139,92,246,0.25)] hover:border-primary/40 transition-all duration-500 group cursor-pointer select-none mb-1 relative"
    >
      {posterUrl ? (
        <img
          src={posterUrl}
          alt={title || 'Media Poster'}
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
          width={342}
          height={513}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-[#1A1A22] to-[#13131A] flex items-center justify-center border border-white/5">
          <span className="text-xs text-text-muted font-bold text-center px-4">No Image Available</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent flex flex-col justify-end p-4 pb-5">
        <span className="text-white text-center text-[11px] sm:text-xs font-black uppercase tracking-widest drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] leading-tight font-sans">
          {title}
        </span>
      </div>
    </motion.div>
  );
};
