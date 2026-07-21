import * as React from 'react';
import { StreamingServerSelector } from './StreamingServerSelector';
import { LanguageSelector } from './LanguageSelector';
import { Download, ExternalLink } from 'lucide-react';

interface PlayerControllerProps {
  activeServerId: string;
  onServerChange: (serverId: string) => void;
  tmdbId?: string | number;
  type?: 'movie' | 'tv';
}

export const PlayerController: React.FC<PlayerControllerProps> = ({
  activeServerId,
  onServerChange,
  tmdbId,
  type = 'movie',
}) => {
  const isTV = type === 'tv';
  const downloadUrl = tmdbId
    ? isTV
      ? `https://vidvault.ru/tv/${tmdbId}/1/1`
      : `https://vidvault.ru/movie/${tmdbId}`
    : '';

  const handleDownloadClick = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div 
      className="w-full max-w-5xl mx-auto bg-[#13131A] border border-white/[0.04] rounded-3xl p-6 md:p-8 space-y-6 text-left"
      id="watch-stream-servers-panel"
    >
      <div className="space-y-1 select-none">
        <h3 className="text-sm font-black text-white uppercase tracking-wider">
          Multi-Server Routing Hub
        </h3>
        <p className="text-xs text-text-muted font-medium">
          If you experience buffer delays, please instantly switch between our secure high-speed nodes.
        </p>
      </div>

      <div className="flex flex-col gap-6 pt-2">
        <StreamingServerSelector
          activeServerId={activeServerId}
          onServerSelect={onServerChange}
        />

        <LanguageSelector
          activeServerId={activeServerId}
          onServerSelect={onServerChange}
        />
      </div>

      {/* External Download Section */}
      <div className="border-t border-white/[0.04] pt-6 space-y-4" id="watch-download-section">
        <div className="space-y-1 select-none">
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            DOWNLOAD OPTIONS
          </h3>
          <p className="text-xs text-text-muted font-medium">
            Retrieve offline direct-link copies of this title via high-speed mirror paths.
          </p>
        </div>

        <div>
          <button
            onClick={handleDownloadClick}
            disabled={!tmdbId}
            className={`w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-95 active:scale-95 text-xs font-black text-white transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-lg shadow-purple-glow shrink-0 group ${
              !tmdbId ? 'opacity-40 cursor-not-allowed pointer-events-none shadow-none' : ''
            }`}
            id="btn-external-download"
          >
            <Download className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5" />
            <span>{isTV ? 'Download TV Show' : 'Download Movie'}</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
          
          <p className="text-[10px] text-text-muted font-medium mt-2.5 leading-relaxed">
            You'll be redirected to an external download provider.
          </p>
        </div>
      </div>
    </div>
  );
};
