import * as React from 'react';
import { cn } from '../../lib/utils';

export interface BreadcrumbProps {
  pageTitle: string;
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, className }) => {
  const displayTitle = pageTitle === 'home' 
    ? 'HOME PORTAL' 
    : pageTitle === 'movie-details' 
    ? 'MOVIE DETAILS' 
    : pageTitle === 'tv-details' 
    ? 'TV SHOW DETAILS' 
    : pageTitle === 'tvshows'
    ? 'TV SHOWS'
    : pageTitle.toUpperCase();

  return (
    <div
      className={cn(
        'text-[12px] font-medium text-text-muted uppercase tracking-wider select-none leading-none mb-1.5',
        className
      )}
    >
      <span>MOVIYFLY</span>
      <span className="mx-1.5 text-white/20">/</span>
      <span className="text-[#7C3AED] font-semibold">{displayTitle}</span>
    </div>
  );
};
