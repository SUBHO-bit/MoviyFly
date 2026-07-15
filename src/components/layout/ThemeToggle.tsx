import * as React from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const handleClick = () => {
    alert('MoviyFly is optimized for cinema with AMOLED Dark theme only.');
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'h-10 w-10 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/[0.05] rounded-[10px] transition-all duration-200 outline-none focus:ring-1 focus:ring-white/20 cursor-pointer shrink-0 select-none',
        className
      )}
      title="Theme selection is AMOLED dark by default"
      aria-label="Theme is locked to cinema dark mode"
    >
      <Sun className="h-5 w-5" strokeWidth={1.5} />
    </button>
  );
};
