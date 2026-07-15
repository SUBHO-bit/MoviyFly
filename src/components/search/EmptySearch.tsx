import * as React from 'react';
import { SearchX, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const EmptySearch: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center w-full min-h-[400px] select-none" id="empty-search-state">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md p-8 sm:p-10 rounded-3xl bg-[#141419]/80 border border-white/[0.04] shadow-large relative overflow-hidden backdrop-blur-md"
      >
        {/* Glowing backdrop effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Central visual indicator */}
        <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-tr from-primary/10 to-accent/10 border border-primary/25 flex items-center justify-center mb-6 shadow-purple-glow">
          <SearchX className="h-9 w-9 text-primary" />
        </div>

        {/* Messaging */}
        <h3 className="text-xl font-extrabold text-white tracking-tight mb-2">
          No Results Found
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed mb-6 font-medium">
          Try another title, actor, studio, or keyword. Make sure the spelling is correct, or browse our trending selections.
        </p>

        {/* Custom recommendation chip indicators */}
        <div className="flex flex-col gap-2 pt-4 border-t border-white/[0.05]">
          <span className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-1">
            Search Ideas
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {['Marvel', 'Sci-Fi', 'Netflix Originals', 'Christopher Nolan'].map((idea, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-3 py-1 bg-white/[0.03] border border-white/[0.04] rounded-full text-xs font-bold text-text-secondary hover:text-white hover:border-primary/20 transition-all"
              >
                <Sparkles className="h-3 w-3 text-primary" />
                {idea}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
