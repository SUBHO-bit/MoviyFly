import * as React from 'react';
import { cn } from '../../lib/utils';
import { UserProfileCard } from './UserProfileCard';
import { CollapseButton } from './CollapseButton';

export interface SidebarFooterProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  className?: string;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  collapsed,
  onToggleCollapse,
  className,
}) => {
  return (
    <div
      className={cn(
        'p-4 border-t border-white/[0.05] bg-transparent shrink-0 flex flex-col gap-3',
        className
      )}
    >
      <UserProfileCard
        collapsed={collapsed}
        username="dasram"
        email="dasram98081@gmail.com"
        tier="VIP"
      />

      {/* When collapsed, we can also show a centered toggle button to allow the user to easily expand */}
      {collapsed && (
        <div className="flex justify-center pt-2">
          <CollapseButton
            collapsed={collapsed}
            onClick={onToggleCollapse}
            className="h-7 w-7"
          />
        </div>
      )}
    </div>
  );
};
