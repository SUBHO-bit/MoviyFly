import * as React from 'react';
import { cn } from '../../lib/utils';
import { GenreChip } from './GenreChip';

export interface MovieMetaProps {
  title: string;
  year: number | string;
  runtime: string;
  rating: string | number;
  genres: string[];
  className?: string;
}

export const MovieMeta: React.FC<MovieMetaProps> = ({
  title,
  year,
  runtime,
  rating,
  genres,
  className,
}) => {
  // Take at most 2 genres
  const displayedGenres = genres.slice(0, 2);

  return (
    <div className={cn('flex flex-col gap-1 md:gap-1.5 pt-3', className)}>
      {/* Movie Title */}
      <h4 className="text-base md:text-[18px] font-bold text-white tracking-tight leading-tight line-clamp-1 group-hover:text-[#8B5CF6] transition-colors duration-250 mb-0.5">
        {title}
      </h4>

      {/* Release Year, Runtime, and rating info */}
      <div className="flex items-center gap-1.5 text-xs md:text-sm text-[#B3B3B8] font-medium leading-none">
        <span>{year}</span>
        <span className="text-white/10 text-[10px] select-none">•</span>
        <span>{runtime}</span>
        <span className="text-white/10 text-[10px] select-none">•</span>
        <span className="text-white/90 bg-white/[0.06] px-1.5 py-0.5 rounded text-[10px] font-bold">
          ★ {rating}
        </span>
      </div>

      {/* Genre Chips Container */}
      <div className="flex flex-wrap items-center gap-1.5 mt-1">
        {displayedGenres.map((genre) => (
          <GenreChip key={genre} label={genre} />
        ))}
      </div>
    </div>
  );
};
