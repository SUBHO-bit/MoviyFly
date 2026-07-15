import * as React from 'react';
import { AlertTriangle, ChevronLeft, RefreshCw } from 'lucide-react';

interface MediaErrorProps {
  error: string;
  onBack: () => void;
  onRetry?: () => void;
}

export const MediaError: React.FC<MediaErrorProps> = ({
  error,
  onBack,
  onRetry,
}) => {
  const is404 = error.includes('404') || error.toLowerCase().includes('not found');

  return (
    <div className="w-full flex-grow flex items-center justify-center py-20 px-4 select-none">
      <div className="text-center max-w-md p-10 rounded-[32px] bg-[#1A1A22] border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="mx-auto h-16 w-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6 shadow-purple-glow animate-pulse">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>

        <h2 className="text-2xl font-extrabold text-white tracking-tight mb-3">
          {is404 ? 'Cinema Title Not Found' : 'Connection Failure'}
        </h2>
        
        <p className="text-xs text-[#B3B3B8] leading-relaxed mb-8">
          {is404 
            ? 'The requested cinematic media could not be located in the TMDB global catalog. It may have been retired or catalog identifiers are incorrect.' 
            : `We encountered a connection issue syncing with the TMDB server. Please verify your secrets setup and try again.`
          }
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onBack}
            className="flex-grow py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            id="btn-error-back"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Catalog</span>
          </button>
          
          {!is404 && onRetry && (
            <button
              onClick={onRetry}
              className="flex-grow py-3 px-5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white font-bold text-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              id="btn-error-retry"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry Connection</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
