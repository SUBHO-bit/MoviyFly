import * as React from 'react';
import { Flame } from 'lucide-react';
import { cn } from '../../lib/utils';
import { GenreChip } from './GenreChip';
import { HeroMetadata } from './HeroMetadata';
import { HeroButtons } from './HeroButtons';

export interface HeroContentProps {
  title: string;
  overview: string;
  genres: string[];
  rating: string | number;
  year: number | string;
  runtime: string;
  language: string;
  ageRating: string;
  isTrending?: boolean;
  isInWatchlist?: boolean;
  logoUrl?: string | null;
  onWatchNow?: () => void;
  onMoreDetails?: () => void;
  onToggleWatchlist?: () => void;
  className?: string;
}

export const HeroContent: React.FC<HeroContentProps> = ({
  title,
  overview,
  genres,
  rating,
  year,
  runtime,
  language,
  ageRating,
  isTrending = true,
  isInWatchlist = false,
  logoUrl,
  onWatchNow,
  onMoreDetails,
  onToggleWatchlist,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-6 max-w-2xl select-none', className)}>
      {/* Top row: Trending Badge and Genre Chips */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Trending Now Badge */}
        {isTrending && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20 rounded-full select-none uppercase tracking-wider">
            <Flame className="h-3.5 w-3.5 fill-[#F97316]" strokeWidth={1.5} />
            <span>Trending Now</span>
          </span>
        )}

        {/* Genre Chips */}
        <div className="flex items-center gap-1.5">
          {genres.map((genre) => (
            <GenreChip key={genre} label={genre} />
          ))}
        </div>
      </div>

      {/* Movie Title or Logo */}
      {logoUrl ? (
        <div className="h-24 sm:h-28 lg:h-[140px] xl:h-[150px] flex items-center justify-start select-none max-w-[90%] sm:max-w-[450px] lg:max-w-[550px]">
          <img
            src={logoUrl}
            alt={title}
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.95)] transition-all duration-300"
            referrerPolicy="no-referrer"
            loading="lazy"
            decoding="async"
            width={500}
            height={150}
          />
        </div>
      ) : (
        <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/80 tracking-tighter uppercase leading-[0.95] sm:leading-[1] filter drop-shadow-[0_8px_24px_rgba(0,0,0,0.95)] select-none">
          {title}
        </h2>
      )}

      {/* Movie Metadata row */}
      <HeroMetadata
        rating={rating}
        year={year}
        runtime={runtime}
        language={language}
        ageRating={ageRating}
      />

      {/* Description / Summary (Max 3 lines, highly readable, around 520px) */}
      <p className="text-sm md:text-base text-text-secondary leading-relaxed line-clamp-3 font-normal max-w-[520px]">
        {overview}
      </p>

      {/* Play/Detail buttons group */}
      <div className="pt-2">
        <HeroButtons
          onWatchNow={onWatchNow}
          onMoreDetails={onMoreDetails}
          onToggleWatchlist={onToggleWatchlist}
          isInWatchlist={isInWatchlist}
        />
      </div>
    </div>
  );
};
