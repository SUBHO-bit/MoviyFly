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
        'inline-flex items-center justify-center px-2.5 py-1 text-[11px] font-semibold text-text-secondary bg-white/[0.04] border border-white/[0.06] rounded-md backdrop-blur-sm select-none',
        className
      )}
    >
      {label}
    </span>
  );
};
