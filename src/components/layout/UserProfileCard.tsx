import * as React from 'react';
import { User, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export interface UserProfileCardProps {
  collapsed: boolean;
  className?: string;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({
  collapsed,
  className,
}) => {
  const { openSignIn, openSignUp, isAuthenticated, userProfile, logout } = useAuth();

  const handleAction = () => {
    if (isAuthenticated) {
      if (window.confirm('Would you like to log out from MoviyFly?')) {
        logout();
      }
    } else {
      openSignIn();
    }
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-3 p-3 rounded-[18px] bg-[#0C0C12]/15 backdrop-blur-[12px] border border-white/[0.06] transition-all duration-250 select-none overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.15)]',
        collapsed ? 'justify-center bg-transparent border-transparent p-0 backdrop-blur-none shadow-none hover:bg-transparent' : 'hover:bg-[#121216]/25 hover:border-white/[0.1]',
        className
      )}
      style={{
        WebkitBackdropFilter: collapsed ? 'none' : 'blur(12px)'
      }}
    >
      {collapsed ? (
        /* Collapsed Icon button opening a tooltip or trigger alert */
        <button
          onClick={handleAction}
          className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 border border-white/[0.08] hover:border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] hover:text-white transition-all duration-200 cursor-pointer shrink-0 outline-none focus:ring-1 focus:ring-white/20 font-bold overflow-hidden"
          title={isAuthenticated ? `Sign Out (${userProfile?.displayName || userProfile?.username})` : "Account (Guest)"}
          aria-label={isAuthenticated ? "Sign Out" : "Account Login"}
        >
          {isAuthenticated && userProfile?.photoURL ? (
            <img 
              src={userProfile.photoURL} 
              alt={userProfile.displayName || userProfile.username} 
              className="h-full w-full object-cover" 
              referrerPolicy="no-referrer" 
            />
          ) : isAuthenticated ? (
            <span>{(userProfile?.displayName || userProfile?.username || 'U').substring(0, 1).toUpperCase()}</span>
          ) : (
            <User className="h-5 w-5 text-[#B3B3B8] hover:text-white transition-colors" strokeWidth={1.5} />
          )}
        </button>
      ) : isAuthenticated ? (
        /* Not Collapsed Logged In Card with user details and logout button */
        <div className="w-full flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5 px-1">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 border border-white/[0.08] flex items-center justify-center text-[#8B5CF6] overflow-hidden font-bold text-xs shrink-0">
              {userProfile?.photoURL ? (
                <img 
                  src={userProfile.photoURL} 
                  alt={userProfile.displayName || userProfile.username} 
                  className="h-full w-full object-cover" 
                  referrerPolicy="no-referrer" 
                />
              ) : (
                <span>{(userProfile?.displayName || userProfile?.username || 'U').substring(0, 1).toUpperCase()}</span>
              )}
            </div>
            <div className="flex flex-col select-none leading-none max-w-[125px]">
              <span className="text-[11px] font-semibold text-white truncate">
                {userProfile?.displayName || userProfile?.username}
              </span>
              <span className="text-[9px] text-text-muted mt-1 truncate">
                {userProfile?.role === 'admin' ? 'Administrator' : 'Premium Member'}
              </span>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="w-full px-3 py-1.5 rounded-lg text-[10px] font-bold text-red-400 bg-red-500/[0.06] hover:bg-red-500/[0.1] border border-red-500/10 hover:border-red-500/20 transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
          >
            <LogOut className="h-3 w-3" strokeWidth={1.5} />
            <span>Log Out</span>
          </button>
        </div>
      ) : (
        /* Not Collapsed Guest Card with stacked login / signup buttons */
        <div className="w-full flex flex-col gap-2.5">
          <div className="flex items-center gap-2.5 px-1">
            <div className="h-8 w-8 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#B3B3B8]">
              <User className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col select-none leading-none">
              <span className="text-[11px] font-semibold text-white">Guest User</span>
              <span className="text-[9px] text-text-muted mt-1">Enjoy unlimited streaming</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-0.5">
            <button
              onClick={openSignIn}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] transition-all text-center hover:scale-[1.02] cursor-pointer shadow-[0_2px_8px_rgba(139,92,246,0.15)]"
            >
              Log In
            </button>
            <button
              onClick={openSignUp}
              className="px-3 py-1.5 rounded-lg text-[10px] font-bold text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.12] transition-all text-center hover:scale-[1.02] cursor-pointer"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
