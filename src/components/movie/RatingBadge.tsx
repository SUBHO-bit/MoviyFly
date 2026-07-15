import * as React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface RatingBadgeProps {
  rating: string | number;
  className?: string;
}

export const RatingBadge: React.FC<RatingBadgeProps> = ({ rating, className }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#18181C]/90 backdrop-blur-md border border-white/[0.06] text-[11px] font-bold text-white shadow-md select-none',
        className
      )}
    >
      <Star className="h-3.5 w-3.5 fill-[#EAB308] text-[#EAB308]" strokeWidth={1.5} />
      <span>{rating}</span>
    </div>
  );
};
