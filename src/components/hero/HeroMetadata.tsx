import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface HeroMetadataProps {
  rating: string | number;
  year: number | string;
  runtime: string;
  language: string;
  ageRating: string;
  qualityTags?: string[];
  className?: string;
}

export const HeroMetadata: React.FC<HeroMetadataProps> = ({
  rating,
  year,
  runtime,
  language,
  ageRating,
  qualityTags = ['4K', 'HDR'],
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-text-secondary select-none font-medium',
        className
      )}
    >
      {/* IMDb Rating Badge */}
      <div className="flex items-center gap-1 font-semibold text-white">
        <Star className="h-3.5 w-3.5 fill-[#EAB308] text-[#EAB308]" strokeWidth={1.5} />
        <span>IMDb</span>
        <span className="text-white/90 bg-white/[0.06] border border-white/[0.08] px-1.5 py-0.5 rounded-md text-[11px] font-bold">
          {rating}
        </span>
      </div>

      {/* Spacing Delimiters */}
      <span className="text-white/10 text-[10px]">•</span>

      {/* Year */}
      <span>{year}</span>

      <span className="text-white/10 text-[10px]">•</span>

      {/* Runtime */}
      <span>{runtime}</span>

      <span className="text-white/10 text-[10px]">•</span>

      {/* Language */}
      <span className="uppercase text-[11px]">{language}</span>

      <span className="text-white/10 text-[10px]">•</span>

      {/* Age Rating */}
      <span className="text-[11px] px-1.5 py-0.5 bg-white/[0.04] border border-white/[0.06] rounded font-bold text-white/90">
        {ageRating}
      </span>

      {/* Dynamic quality tags */}
      {qualityTags.map((tag) => (
        <React.Fragment key={tag}>
          <span className="text-white/10 text-[10px]">•</span>
          <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 bg-[#7C3AED]/12 text-[#A78BFA] border border-[#7C3AED]/20 rounded-md">
            {tag}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
};
