import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Settings,
  Tv,
  CreditCard,
  LogOut,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ProfileMenuProps {
  className?: string;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({ className }) => {
  const [isOpen, setIsOpen] = React.useState(false);
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

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      {/* Trigger Button - Flat, minimal, 40px avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-white/[0.04] border border-transparent transition-all duration-200 cursor-pointer select-none outline-none focus:ring-1 focus:ring-white/20"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <div className="h-10 w-10 rounded-xl bg-[#7C3AED]/20 border border-[#7C3AED]/30 flex items-center justify-center font-bold text-white text-sm shrink-0">
          DR
        </div>
        <div className="hidden sm:flex flex-col items-start leading-none select-none">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-white max-w-[80px] truncate">
              dasram
            </span>
            <span className="text-[8px] font-bold bg-[#7C3AED] text-white px-1.5 py-0.5 rounded uppercase tracking-wider">
              VIP
            </span>
          </div>
          <span className="text-[10px] text-text-muted mt-1 font-normal">
            Account Owner
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="h-4 w-4 text-text-muted hidden sm:block" strokeWidth={1.5} />
        ) : (
          <ChevronDown className="h-4 w-4 text-text-muted hidden sm:block" strokeWidth={1.5} />
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
            className="absolute right-0 mt-2 w-60 bg-[#17171C] border border-white/[0.06] rounded-xl shadow-2xl py-2 z-50 overflow-hidden"
          >
            {/* Header User Card */}
            <div className="px-4 py-3 border-b border-white/[0.04] flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center font-bold text-white text-xs shrink-0">
                DR
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate leading-none">dasram</p>
                <p className="text-[10px] text-text-muted truncate mt-1">dasram98081@gmail.com</p>
              </div>
            </div>

            {/* Menu Options */}
            <div className="px-1 py-1 space-y-0.5">
              {[
                { label: 'Profile Settings', icon: <User className="h-4 w-4" />, onClick: () => alert('Edit profile details...') },
                { label: 'Manage Screens', icon: <Tv className="h-4 w-4" />, onClick: () => alert('Manage connected devices...') },
                { label: 'Billing & Plans', icon: <CreditCard className="h-4 w-4" />, onClick: () => alert('Update credit card info...') },
                { label: 'App Settings', icon: <Settings className="h-4 w-4" />, onClick: () => alert('Change video playback qualities...') },
                { label: 'Help Center', icon: <HelpCircle className="h-4 w-4" />, onClick: () => alert('Search support articles...') },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-text-secondary hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer text-left"
                >
                  <span className="text-text-muted group-hover:text-white shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/[0.04] my-1" />

            {/* Logout Action */}
            <div className="px-1">
              <button
                onClick={() => {
                  alert('Signing out of MoviyFly...');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-text-muted hover:text-danger hover:bg-danger/10 transition-all cursor-pointer text-left"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.5} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
