import * as React from 'react';
import { motion } from 'motion/react';
import { Play, Heart, Share2 } from 'lucide-react';

interface MediaButtonsProps {
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
  onWatchNow: () => void;
}

export const MediaButtons: React.FC<MediaButtonsProps> = ({
  isInWatchlist,
  onToggleWatchlist,
  onWatchNow,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.42 }}
      className="flex flex-wrap items-center gap-3.5 pt-3 select-none"
    >
      {/* Watch Now Button */}
      <motion.button
        whileHover={{ scale: 1.03, boxShadow: '0 0 35px 10px rgba(139, 92, 246, 0.5)' }}
        whileTap={{ scale: 0.97 }}
        onClick={onWatchNow}
        className="flex items-center gap-3.5 px-8 py-3.5 rounded-full bg-[#8B5CF6] hover:bg-[#A855F7] text-white font-extrabold text-xs sm:text-sm shadow-[0_4px_25px_rgba(139, 92, 246, 0.35)] transition-all duration-300 cursor-pointer"
        id="btn-watch-now"
      >
        <Play className="h-4.5 w-4.5 fill-white text-white animate-pulse" />
        <span>Watch Now</span>
      </motion.button>

      {/* Add to Wishlist Button */}
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderColor: 'rgba(239, 68, 68, 0.5)' }}
        whileTap={{ scale: 0.93 }}
        onClick={onToggleWatchlist}
        className={`flex items-center justify-center p-3 rounded-full border transition-all cursor-pointer h-11 w-11 sm:h-12 sm:w-12 backdrop-blur-md ${
          isInWatchlist
            ? 'bg-red-500/20 border-red-500/50 text-red-500 hover:bg-red-500/30 shadow-[0_4px_20px_rgba(239,68,68,0.3)]'
            : 'bg-white/10 border-white/10 text-white hover:bg-white/15'
        }`}
        title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        aria-label="Toggle watchlist"
        id="btn-toggle-watchlist"
      >
        <Heart className={`h-4.5 w-4.5 transition-transform duration-300 ${isInWatchlist ? 'fill-red-500 scale-110' : ''}`} />
      </motion.button>

      {/* Share Button */}
      <motion.button
        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderColor: 'rgba(139, 92, 246, 0.5)' }}
        whileTap={{ scale: 0.93 }}
        onClick={handleShare}
        className="flex items-center justify-center p-3 rounded-full bg-white/10 border border-white/10 text-white transition-all cursor-pointer h-11 w-11 sm:h-12 sm:w-12 relative backdrop-blur-md"
        title="Copy Link to Share"
        aria-label="Share movie link"
        id="btn-share-movie"
      >
        <Share2 className="h-4.5 w-4.5" />
        {copied && (
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white font-bold text-[10px] px-3.5 py-1.5 rounded-xl shadow-lg pointer-events-none whitespace-nowrap animate-fade-in border border-white/10 backdrop-blur-md">
            Link Copied!
          </span>
        )}
      </motion.button>
    </motion.div>
  );
};
