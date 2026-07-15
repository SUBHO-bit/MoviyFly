import * as React from 'react';
import { cn } from '../../lib/utils';

export interface CarouselIndicatorsProps {
  total: number;
  current: number;
  onChange: (index: number) => void;
  className?: string;
}

export const CarouselIndicators: React.FC<CarouselIndicatorsProps> = ({
  total,
  current,
  onChange,
  className,
}) => {
  return (
    <div className={cn('flex items-center gap-2 select-none', className)}>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className={cn(
            'h-2 rounded-full transition-all duration-300 outline-none cursor-pointer focus:ring-1 focus:ring-[#7C3AED]/40',
            current === i
              ? 'w-6 bg-[#7C3AED]'
              : 'w-2 bg-white/20 hover:bg-white/40'
          )}
          aria-label={`Go to slide ${i + 1}`}
          aria-current={current === i ? 'true' : 'false'}
        />
      ))}
    </div>
  );
};
