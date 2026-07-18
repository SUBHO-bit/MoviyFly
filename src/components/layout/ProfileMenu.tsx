import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  LogIn,
  UserPlus,
  LogOut,
  Settings,
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export interface ProfileMenuProps {
  className?: string;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ className }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { openSignIn, openSignUp, isAuthenticated, userProfile, logout } = useAuth();
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (err) {
      console.error('[ProfileMenu] Logout failed:', err);
    }
  };

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      {/* Trigger Button - Flat, minimal, 40px avatar representing User/Guest */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/[0.04] border border-transparent transition-all duration-200 cursor-pointer select-none outline-none focus:ring-1 focus:ring-white/20 group"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-white/[0.08] flex items-center justify-center text-[#8B5CF6] group-hover:text-white transition-colors shrink-0 overflow-hidden font-bold text-sm">
          {isAuthenticated && userProfile?.photoURL ? (
            <img 
              src={userProfile.photoURL} 
              alt={userProfile.displayName || userProfile.username} 
              className="h-full w-full object-cover" 
              referrerPolicy="no-referrer" 
            />
          ) : isAuthenticated ? (
            <span className="text-[#8B5CF6] group-hover:text-white transition-colors font-bold">
              {(userProfile?.displayName || userProfile?.username || 'U').substring(0, 1).toUpperCase()}
            </span>
          ) : (
            <User className="h-5 w-5 text-[#B3B3B8] group-hover:text-white transition-colors" strokeWidth={1.5} />
          )}
        </div>
        <div className="hidden sm:flex flex-col items-start leading-none select-none">
          <span className="text-xs font-semibold text-white">
            {isAuthenticated ? (userProfile?.displayName || userProfile?.username || 'User') : 'Guest Account'}
          </span>
          <span className="text-[10px] text-text-muted mt-1 font-normal">
            {isAuthenticated ? (userProfile?.role === 'admin' ? 'Administrator' : 'Premium Member') : 'Sign In / Sign Up'}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-[#B3B3B8] hidden sm:block" strokeWidth={1.5} />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#B3B3B8] hidden sm:block" strokeWidth={1.5} />
        )}
      </button>

      {/* Dropdown Menu - No glow, no glass, flat #17171C, 1px border */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-64 bg-[#17171C] border border-white/[0.06] rounded-xl shadow-2xl py-2.5 z-50 overflow-hidden"
          >
            {isAuthenticated ? (
              <>
                {/* Header User Card */}
                <div className="px-4 py-3 border-b border-white/[0.04] flex flex-col gap-1">
                  <p className="text-xs font-bold text-white leading-none">
                    {userProfile?.displayName || userProfile?.username}
                  </p>
                  <p className="text-[10px] text-text-muted leading-relaxed truncate">
                    {userProfile?.email}
                  </p>
                </div>

                {/* Authenticated Actions */}
                <div className="px-1.5 py-1.5 border-b border-white/[0.04] space-y-0.5">
                  <button
                    onClick={() => {
                      alert('Account settings feature is coming soon.');
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer text-left"
                  >
                    <Settings className="h-4 w-4 text-text-muted shrink-0" strokeWidth={1.5} />
                    <span>Account Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      alert('Help Center resources are loading...');
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer text-left"
                  >
                    <HelpCircle className="h-4 w-4 text-text-muted shrink-0" strokeWidth={1.5} />
                    <span>Help Center</span>
                  </button>
                </div>

                {/* Logout Option */}
                <div className="px-1.5 py-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/[0.06] transition-all cursor-pointer text-left"
                  >
                    <LogOut className="h-4 w-4 text-red-400/80 shrink-0" strokeWidth={1.5} />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Header Guest Card */}
                <div className="px-4 py-3 border-b border-white/[0.04] flex flex-col gap-1.5">
                  <p className="text-xs font-bold text-white leading-none">Welcome to MoviyFly</p>
                  <p className="text-[10px] text-text-muted leading-relaxed">
                    Log in or sign up to sync your watchlist, resume playback, and unlock personalized recommendations.
                  </p>
                </div>

                {/* Quick Guest Actions */}
                <div className="px-3 py-3 space-y-2 border-b border-white/[0.04]">
                  <button
                    onClick={() => {
                      openSignIn();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] hover:from-[#7C3AED] hover:to-[#9333EA] transition-all duration-200 hover:scale-[1.01] cursor-pointer shadow-[0_4px_12px_rgba(139,92,246,0.2)]"
                  >
                    <LogIn className="h-4 w-4" strokeWidth={1.5} />
                    <span>Log In</span>
                  </button>
                  <button
                    onClick={() => {
                      openSignUp();
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.12] transition-all duration-200 hover:scale-[1.01] cursor-pointer"
                  >
                    <UserPlus className="h-4 w-4" strokeWidth={1.5} />
                    <span>Sign Up</span>
                  </button>
                </div>

                {/* Utility Options for Guest */}
                <div className="px-1.5 py-1.5">
                  <button
                    onClick={() => {
                      alert('Help Center resources are loading...');
                      setIsOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer text-left"
                  >
                    <HelpCircle className="h-4 w-4 text-text-muted shrink-0" strokeWidth={1.5} />
                    <span>Help Center</span>
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
