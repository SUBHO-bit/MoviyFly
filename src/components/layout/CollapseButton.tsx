import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CollapseButtonProps {
  collapsed: boolean;
  onClick: () => void;
  className?: string;
}

export const CollapseButton: React.FC<CollapseButtonProps> = ({
  collapsed,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-7 w-7 rounded-md border border-white/[0.06] bg-white/[0.02] text-text-muted hover:text-white hover:bg-white/[0.06] flex items-center justify-center transition-all duration-200 outline-none focus:ring-1 focus:ring-[#7C3AED]/50 focus:border-[#7C3AED]/50 cursor-pointer select-none',
        className
      )}
      aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      title={collapsed ? 'Expand' : 'Collapse'}
    >
      {collapsed ? (
        <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
      ) : (
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
      )}
    </button>
  );
};
