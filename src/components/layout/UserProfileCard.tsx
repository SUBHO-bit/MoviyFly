import * as React from 'react';
import { LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface UserProfileCardProps {
  collapsed: boolean;
  username: string;
  email: string;
  tier?: string;
  onLogout?: () => void;
  className?: string;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  collapsed,
  username,
  email,
  tier = 'VIP',
  onLogout,
  className,
}) => {
  const handleLogoutClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onLogout) {
      onLogout();
    } else {
      alert('Signing out of MoviyFly...');
    }
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 p-2.5 rounded-[18px] bg-[#0C0C12]/15 backdrop-blur-[12px] border border-white/[0.06] transition-all duration-250 select-none overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)] hover:bg-[#121216]/25 hover:border-white/[0.1]',
        collapsed ? 'justify-center bg-transparent border-transparent p-0 backdrop-blur-none shadow-none hover:bg-transparent' : '',
        className
      )}
      style={{
        WebkitBackdropFilter: collapsed ? 'none' : 'blur(12px)'
      }}
    >
      {/* Avatar with simple solid ring */}
      <div className="relative shrink-0">
        <div className="h-9 w-9 rounded-full bg-[#8C5CFF]/20 border border-[#8C5CFF]/30 flex items-center justify-center font-semibold text-white text-xs">
          DR
        </div>
        {/* Subtle Online Dot */}
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success border border-background" />
      </div>

      {/* Info area */}
      {!collapsed && (
        <div className="flex-grow min-w-0 select-none">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-white truncate">
              {username}
            </span>
            {tier && (
              <span className="text-[8px] font-bold bg-[#8C5CFF] text-white px-1.5 py-0.5 rounded uppercase tracking-wider scale-95 origin-left shadow-[0_0_8px_rgba(140,92,255,0.25)]">
                {tier}
              </span>
            )}
          </div>
          <p className="text-[10px] text-text-muted truncate leading-normal mt-0.5">
            {email}
          </p>
        </div>
      )}

      {/* Logout button */}
      {!collapsed && (
        <button
          onClick={handleLogoutClick}
          className="text-text-muted hover:text-danger p-1.5 rounded hover:bg-danger/10 transition-colors cursor-pointer shrink-0 outline-none focus:ring-1 focus:ring-danger/30"
          title="Sign Out"
          aria-label="Sign Out"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.5} />
        </button>
      )}
    </div>
  );
};
