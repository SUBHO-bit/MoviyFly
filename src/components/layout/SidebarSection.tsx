import * as React from 'react';
import { cn } from '../../lib/utils';

export interface SidebarSectionProps {
  title?: string;
  collapsed?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({
  title,
  collapsed = false,
  children,
  className,
}) => {
  return (
    <div className={cn('flex flex-col gap-1 py-3 first:pt-1', className)}>
      {title && !collapsed && (
        <span className="px-4 text-[11px] font-medium text-text-muted uppercase tracking-wider mb-2 select-none leading-none block">
          {title}
        </span>
      )}
      <div className="flex flex-col gap-0.5">
        {children}
      </div>
    </div>
  );
};
