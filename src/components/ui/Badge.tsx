import * as React from 'react';
import { Star, Flame, Sparkles, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';
import { BadgeVariant } from '../../types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  count?: number | string;
  active?: boolean;
  onClick?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'status',
  count,
  active = false,
  onClick,
  children,
  ...props
}) => {
  const isClickable = !!onClick;
  const baseClass = cn(
    'inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-sm uppercase tracking-wider select-none border transition-all duration-200',
    isClickable && 'cursor-pointer active:scale-95'
  );

  const getVariantStyles = () => {
    switch (variant) {
      case 'rating':
        return 'bg-warning/10 border-warning/20 text-warning';
      case 'trending':
        return 'bg-primary/10 border-primary/20 text-primary shadow-purple-glow';
      case 'new':
        return 'bg-success/10 border-success/20 text-success';
      case 'featured':
        return 'bg-[#A855F7]/10 border-[#A855F7]/20 text-[#A855F7]';
      case 'genre':
        return active
          ? 'bg-primary border-primary text-white shadow-purple-glow'
          : 'bg-secondary border-white/5 text-text-secondary hover:text-white hover:border-white/10';
      case 'status':
      default:
        return 'bg-white/5 border-white/5 text-text-secondary';
    }
  };

  const getIcon = () => {
    switch (variant) {
      case 'rating':
        return <Star className="h-3 w-3 fill-warning shrink-0" />;
      case 'trending':
        return <Flame className="h-3 w-3 fill-primary shrink-0 animate-pulse" />;
      case 'new':
        return <Sparkles className="h-3 w-3 shrink-0" />;
      case 'featured':
        return <CheckCircle className="h-3 w-3 shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={cn(baseClass, getVariantStyles(), className)}
      onClick={onClick}
      {...props}
    >
      {getIcon()}
      <span>
        {children}
        {count !== undefined && <span className="ml-1 opacity-80">({count})</span>}
      </span>
    </span>
  );
};

Badge.displayName = 'Badge';
