import * as React from 'react';
import { Server } from 'lucide-react';
import { STREAM_SERVERS, StreamServer } from './StreamingProvider';

interface StreamingServerSelectorProps {
  activeServerId: string;
  onServerSelect: (serverId: string) => void;
}

export const StreamingServerSelector: React.FC<StreamingServerSelectorProps> = ({
  activeServerId,
  onServerSelect,
}) => {
  const servers = STREAM_SERVERS.filter((s) => s.category === 'sources');

  return (
    <div className="space-y-3" id="watch-streaming-servers-group">
      <div className="flex items-center gap-2 text-text-secondary select-none">
        <Server className="h-4 w-4 text-primary" strokeWidth={2} />
        <span className="text-xs font-black uppercase tracking-wider">STREAMING SOURCE</span>
      </div>

      {/* Horizontal scroll on mobile, wrap on tablet, single row/scroll on desktop */}
      <div 
        className="flex items-center gap-2.5 overflow-x-auto md:overflow-x-visible pb-1.5 md:pb-0 scrollbar-none snap-x snap-mandatory"
        role="tablist"
        aria-label="Select streaming source"
      >
        {servers.map((server) => {
          const isActive = activeServerId === server.id;

          return (
            <button
              key={server.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              id={`btn-server-pill-${server.id}`}
              onClick={() => onServerSelect(server.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-300 cursor-pointer snap-start shrink-0 min-w-[110px] text-center select-none ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/20 scale-[1.02]'
                  : 'bg-[#141419] border border-white/[0.04] text-text-secondary hover:text-white hover:border-white/[0.08] hover:bg-white/[0.02]'
              }`}
            >
              {server.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
