import * as React from 'react';
import { cn } from '../../lib/utils';

export interface GenreChipProps {
  label: string;
  className?: string;
}

export const GenreChip: React.FC<GenreChipProps> = ({ label, className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-[10px] font-semibold text-[#B3B3B8] bg-white/[0.04] border border-white/[0.06] rounded-md select-none tracking-wide uppercase',
        className
      )}
    >
      {label}
    </span>
  );
};
