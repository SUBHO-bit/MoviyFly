import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';

interface MediaSoundToggleProps {
  isMuted: boolean;
  onToggleMute: () => void;
}

export const MediaSoundToggle: React.FC<MediaSoundToggleProps> = ({ isMuted, onToggleMute }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)' }}
      whileTap={{ scale: 0.9 }}
      onClick={onToggleMute}
      className="absolute bottom-16 right-4 md:right-[5%] lg:right-[6%] z-30 flex items-center justify-center w-11 h-11 rounded-full bg-black/40 border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 text-white shadow-lg cursor-pointer backdrop-blur-md transition-all duration-300"
      title={isMuted ? 'Unmute Trailer' : 'Mute Trailer'}
      id="btn-toggle-trailer-mute"
    >
      <div className="absolute inset-0 rounded-full bg-[#8B5CF6]/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={isMuted ? 'muted' : 'unmuted'}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 flex items-center justify-center"
        >
          {isMuted ? (
            <VolumeX className="h-4.5 w-4.5 text-red-400" />
          ) : (
            <Volume2 className="h-4.5 w-4.5 text-purple-400" />
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {!isMuted && (
          <motion.span 
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1.4, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full bg-[#8B5CF6]/40 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};
