import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  className?: string;
}

export const CarouselControls: React.FC<CarouselControlsProps> = ({
  onPrev,
  onNext,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2 select-none', className)}>
      {/* Previous Button */}
      <button
        onClick={onPrev}
        className="h-10 w-10 rounded-full bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-white/70 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer outline-none focus:ring-1 focus:ring-[#7C3AED]/40"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="h-10 w-10 rounded-full bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] text-white/70 hover:text-white flex items-center justify-center transition-all duration-200 cursor-pointer outline-none focus:ring-1 focus:ring-[#7C3AED]/40"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
      </button>
    </div>
  );
};
