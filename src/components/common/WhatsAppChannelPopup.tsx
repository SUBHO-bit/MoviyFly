import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, Sparkles, Check } from 'lucide-react';
import {
  WHATSAPP_CHANNEL_URL,
  WHATSAPP_POPUP_STORAGE_KEY,
  WHATSAPP_POPUP_COOLDOWN_MS,
  WHATSAPP_POPUP_DELAY_MS,
} from '../../config/whatsapp';

export interface WhatsAppChannelPopupProps {
  /**
   * Only show when active route/page is Home
   */
  isHomePage?: boolean;
}

export const WhatsAppChannelPopup: React.FC<WhatsAppChannelPopupProps> = ({
  isHomePage = true,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isHomePage) {
      setIsOpen(false);
      return;
    }

    // Check localStorage 24-hour frequency cap
    try {
      const lastShown = localStorage.getItem(WHATSAPP_POPUP_STORAGE_KEY);
      if (lastShown) {
        const lastShownTime = parseInt(lastShown, 10);
        if (!isNaN(lastShownTime) && Date.now() - lastShownTime < WHATSAPP_POPUP_COOLDOWN_MS) {
          // Popup was shown within the last 24 hours
          return;
        }
      }
    } catch (err) {
      console.error('[WhatsAppPopup] Failed to read localStorage:', err);
    }

    // Schedule 3-second delayed popup trigger
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, WHATSAPP_POPUP_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isHomePage]);

  // Handle ESC key and focus lock
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };

    // Lock body scrolling when popup is active
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const recordDismissal = () => {
    try {
      localStorage.setItem(WHATSAPP_POPUP_STORAGE_KEY, Date.now().toString());
    } catch (err) {
      console.error('[WhatsAppPopup] Failed to write localStorage:', err);
    }
  };

  const handleDismiss = () => {
    recordDismissal();
    setIsOpen(false);
  };

  const handleJoinChannel = () => {
    recordDismissal();
    setIsOpen(false);
    window.open(WHATSAPP_CHANNEL_URL, '_blank', 'noopener,noreferrer');
  };

  const updateHighlights = [
    'New Movies',
    'TV Shows',
    'Anime',
    'K-Dramas',
    'Latest Releases',
    'Streaming Updates',
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="whatsapp-popup-title"
        >
          {/* Dimmed backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Glassmorphism modal container */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-[#13131A]/95 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl shadow-purple-950/50 backdrop-blur-xl overflow-hidden text-left z-10"
          >
            {/* Ambient purple & emerald background glows */}
            <div className="absolute -top-12 -right-12 w-44 h-44 bg-[#8B5CF6]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Top Close Button */}
            <button
              onClick={handleDismiss}
              type="button"
              aria-label="Close popup"
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/15 transition-all cursor-pointer z-20 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Icon Badge */}
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-[#8B5CF6]/20 border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10">
                <MessageCircle className="w-6 h-6 fill-emerald-500/20 text-emerald-400" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#8B5CF6]/20 text-[#A855F7] border border-[#8B5CF6]/30">
                  <Sparkles className="w-3 h-3" /> Official Channel
                </span>
                <p className="text-[11px] text-[#B3B3B8] font-medium mt-0.5">MoviyFly Community</p>
              </div>
            </div>

            {/* Popup Title */}
            <h2
              id="whatsapp-popup-title"
              className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-3 flex items-center gap-2"
            >
              <span>📢 Join Our WhatsApp Channel</span>
            </h2>

            {/* Popup Description */}
            <p className="text-xs sm:text-sm text-[#B3B3B8] leading-relaxed mb-4">
              Get instant updates about:
            </p>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-2 mb-5">
              {updateHighlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white/90 font-medium"
                >
                  <div className="flex-shrink-0 w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <p className="text-xs text-[#B3B3B8] leading-relaxed mb-6 italic">
              Join our official WhatsApp Channel and never miss an update.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleJoinChannel}
                type="button"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 group"
              >
                <span className="text-base group-hover:scale-110 transition-transform">💚</span>
                <span>Join WhatsApp Channel</span>
              </button>

              <button
                onClick={handleDismiss}
                type="button"
                className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-semibold text-xs sm:text-sm active:scale-[0.98] transition-all cursor-pointer text-center"
              >
                Not Now
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
