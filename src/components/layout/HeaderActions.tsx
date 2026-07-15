import * as React from 'react';
import { cn } from '../../lib/utils';
import { NotificationButton } from './NotificationButton';
import { ProfileMenu } from './ProfileMenu';

export interface HeaderActionsProps {
  className?: string;
}

export const HeaderActions: React.FC<HeaderActionsProps> = ({ className }) => {
  return (
    <div className={cn('flex items-center gap-2 md:gap-3 shrink-0', className)}>
      {/* Notification Button */}
      <NotificationButton />

      {/* Profile Dropdown Menu */}
      <ProfileMenu />
    </div>
  );
};
