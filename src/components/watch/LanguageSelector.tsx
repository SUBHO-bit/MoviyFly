import * as React from 'react';
import { Globe } from 'lucide-react';
import { STREAM_SERVERS, StreamServer } from './StreamingProvider';

interface LanguageSelectorProps {
  activeServerId: string;
  onServerSelect: (serverId: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  activeServerId,
  onServerSelect,
}) => {
  const backups = STREAM_SERVERS.filter((s) => s.category === 'backups');

  return (
    <div className="space-y-3" id="watch-languages-group">
      <div className="flex items-center gap-2 text-text-secondary select-none">
        <Globe className="h-4 w-4 text-primary" strokeWidth={2} />
        <span className="text-xs font-black uppercase tracking-wider">BACKUP SERVERS</span>
      </div>

      {/* Horizontal scroll on mobile, wrap on tablet, single row/scroll on desktop */}
      <div 
        className="flex items-center gap-2.5 overflow-x-auto md:overflow-x-visible pb-1.5 md:pb-0 scrollbar-none snap-x snap-mandatory"
        role="tablist"
        aria-label="Select backup server"
      >
        {backups.map((backup) => {
          const isActive = activeServerId === backup.id;

          return (
            <button
              key={backup.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              id={`btn-backup-pill-${backup.id}`}
              onClick={() => onServerSelect(backup.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer snap-start shrink-0 min-w-[110px] text-center select-none ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/20 scale-[1.02]'
                  : 'bg-[#141419] border border-white/[0.04] text-text-secondary hover:text-white hover:border-white/[0.08] hover:bg-white/[0.02]'
              }`}
            >
              {backup.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
