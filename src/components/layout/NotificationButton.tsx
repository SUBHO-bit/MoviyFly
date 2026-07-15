import * as React from 'react';
import { Bell, Sparkles, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

export interface NotificationButtonProps {
  className?: string;
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({ className }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'New Episode Added',
      desc: 'Behind The Scenes: Episode 1 is now streaming.',
      time: '2h ago',
      unread: true,
      icon: <Sparkles className="h-4 w-4 text-[#7C3AED]" strokeWidth={1.5} />
    },
    {
      id: 2,
      title: 'Subscription Renewed',
      desc: 'Your VIP premium plan was refreshed successfully.',
      time: '1d ago',
      unread: false,
      icon: <CheckCircle className="h-4 w-4 text-success" strokeWidth={1.5} />
    }
  ];

  const hasUnread = notifications.some(n => n.unread);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'h-10 w-10 flex items-center justify-center text-text-muted hover:text-white hover:bg-white/[0.05] rounded-[10px] transition-all duration-200 outline-none focus:ring-1 focus:ring-white/20 cursor-pointer relative select-none',
          isOpen && 'text-white bg-white/[0.05]',
          className
        )}
        aria-label="View notifications"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Bell className="h-5 w-5" strokeWidth={1.5} />
        {/* Subtle, tiny red notification dot (no pulsing glowing halo) */}
        {hasUnread && (
          <span className="absolute top-[11px] right-[11px] h-2 w-2 rounded-full bg-danger border border-[#0B0B0F]" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-80 bg-[#17171C] border border-white/[0.06] rounded-xl shadow-2xl py-2 z-50 overflow-hidden"
          >
            <div className="px-4 py-2.5 border-b border-white/[0.04] flex items-center justify-between">
              <span className="text-xs font-semibold text-white">Notifications</span>
              <button
                onClick={() => alert('All notifications marked as read.')}
                className="text-[11px] text-[#7C3AED] hover:underline font-medium cursor-pointer"
              >
                Mark all read
              </button>
            </div>

            <div className="divide-y divide-white/[0.04] max-h-64 overflow-y-auto custom-scroll-area">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={cn(
                    'p-3 hover:bg-white/[0.02] flex gap-3 transition-colors cursor-pointer',
                    notif.unread && 'bg-[#7C3AED]/5'
                  )}
                >
                  <div className="h-8 w-8 rounded-lg bg-white/[0.02] border border-white/[0.04] shrink-0 flex items-center justify-center">
                    {notif.icon}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline gap-2">
                      <span className="text-xs font-semibold text-white truncate">{notif.title}</span>
                      <span className="text-[10px] text-text-muted shrink-0 font-medium">{notif.time}</span>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-0.5 leading-normal truncate-2-lines">
                      {notif.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
