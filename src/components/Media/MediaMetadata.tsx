import * as React from 'react';
import { Star, Clock } from 'lucide-react';

interface MediaMetadataProps {
  rating: string;
  releaseYear: string;
  runtime: string;
  ageRating: string;
  language: string;
  status: string;
}

export const MediaMetadata: React.FC<MediaMetadataProps> = ({
  rating,
  releaseYear,
  runtime,
  ageRating,
  language,
  status,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-[#A1A1AA] select-none">
      {/* IMDb Rating Badge */}
      <div className="flex items-center gap-1 bg-[#F5C518]/15 text-[#F5C518] px-3 py-1 rounded-full border border-[#F5C518]/25 shadow-[0_4px_12px_rgba(245,197,24,0.08)] backdrop-blur-md">
        <Star className="h-3 w-3 fill-[#F5C518] stroke-[#F5C518]" />
        <span>{rating} IMDb</span>
      </div>

      {/* Release Year */}
      <div className="bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
        <span>{releaseYear}</span>
      </div>

      {/* Runtime / Seasons */}
      <div className="flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
        <Clock className="h-3 w-3" />
        <span>{runtime}</span>
      </div>

      {/* Age Rating */}
      <div className="bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md uppercase tracking-wide">
        <span>{ageRating}</span>
      </div>

      {/* Original Language */}
      <div className="bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md uppercase">
        <span>{language}</span>
      </div>

      {/* Release Status */}
      {status && (
        <div className="bg-primary/15 text-[#A855F7] px-3 py-1 rounded-full border border-[#8B5CF6]/25 backdrop-blur-md">
          <span>{status}</span>
        </div>
      )}
    </div>
  );
};
