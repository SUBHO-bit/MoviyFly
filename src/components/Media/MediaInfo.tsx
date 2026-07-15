import * as React from 'react';
import { motion } from 'motion/react';
import { MediaMetadata } from './MediaMetadata';

interface MediaInfoProps {
  id: string;
  title: string;
  logoUrl: string | null;
  tagline: string | null;
  genres: { id: number; name: string }[];
  overview: string;
  rating: string;
  releaseYear: string;
  runtime: string;
  ageRating: string;
  language: string;
  status: string;
}

export const MediaInfo: React.FC<MediaInfoProps> = ({
  id,
  title,
  logoUrl,
  tagline,
  genres,
  overview,
  rating,
  releaseYear,
  runtime,
  ageRating,
  language,
  status,
}) => {
  return (
    <div className="flex flex-col gap-5 w-full md:max-w-[65%] lg:max-w-[55%] xl:max-w-[50%]">
      {/* Badges and metadata section */}
      <MediaMetadata
        rating={rating}
        releaseYear={releaseYear}
        runtime={runtime}
        ageRating={ageRating}
        language={language}
        status={status}
      />

      {/* Official branding layout */}
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
              alt={title || 'Media Logo'}
              className="max-h-full w-auto object-contain object-left filter brightness-110 contrast-110"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        ) : (
          <motion.h1
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.05] drop-shadow-[0_8px_32px_rgba(0,0,0,0.95)] font-sans text-left"
          >
            {title}
          </motion.h1>
        )}
        
        {tagline && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.22 }}
            className="text-sm sm:text-base md:text-lg font-serif italic text-purple-400/90 tracking-wide max-w-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] text-left"
          >
            "{tagline}"
          </motion.p>
        )}
      </div>

      {/* Genres Pills Row */}
      <div className="flex flex-wrap gap-1.5 select-none">
        {genres?.map((genre) => (
          <span
            key={genre.id}
            className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.06] text-[#D1D1D6] border border-white/[0.08] hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 backdrop-blur-md"
          >
            {genre.name}
          </span>
        ))}
      </div>

      {/* Core Overview summary */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.32 }}
        className="text-xs sm:text-sm md:text-base text-[#E4E4E7] leading-relaxed max-w-full font-normal tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] opacity-[0.95] text-left"
      >
        {overview || 'No description is available for this title.'}
      </motion.p>
    </div>
  );
};
