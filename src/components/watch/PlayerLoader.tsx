import * as React from 'react';
import { Loader2, Clapperboard } from 'lucide-react';

export const PlayerLoader: React.FC = () => {
  return (
    <div
      className="absolute inset-0 w-full h-full bg-[#0B0B10] flex flex-col items-center justify-center gap-4 z-20 animate-fade-in"
      id="player-loader"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute h-16 w-16 rounded-full border-2 border-primary/20 animate-ping" />
        <div className="h-14 w-14 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center shadow-purple-glow">
          <Loader2 className="h-6 w-6 text-primary animate-spin" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <div className="flex items-center gap-1.5 justify-center">
          <Clapperboard className="h-3.5 w-3.5 text-primary animate-pulse" />
          <span className="text-xs font-black uppercase tracking-widest text-text-secondary">
            Preparing Theater
          </span>
        </div>
        <p className="text-[10px] text-text-muted font-medium">
          Buffering high quality video stream...
        </p>
      </div>
    </div>
  );
};
