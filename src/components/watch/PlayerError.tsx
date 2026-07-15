import * as React from 'react';
import { AlertCircle, RotateCcw, ChevronLeft } from 'lucide-react';

interface PlayerErrorProps {
  onRetry: () => void;
  onBackToMovie: () => void;
}

export const PlayerError: React.FC<PlayerErrorProps> = ({ onRetry, onBackToMovie }) => {
  return (
    <div
      className="absolute inset-0 w-full h-full bg-[#0E0E14] border border-red-500/10 flex flex-col items-center justify-center p-6 text-center z-20"
      id="player-error"
    >
      <div className="max-w-md space-y-6">
        <div className="mx-auto h-14 w-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shadow-lg shadow-red-500/10">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>

        <div className="space-y-2">
          <h4 className="text-base font-extrabold text-white tracking-tight">
            This server is currently unavailable.
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed font-medium">
            Please try another server from our Multi-Server Routing Hub below or retry the current connection.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={onBackToMovie}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            id="btn-player-error-back"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Movie</span>
          </button>
          
          <button
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-[#EF4444] hover:bg-[#EF4444]/90 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-red-500/10"
            id="btn-player-error-retry"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    </div>
  );
};
