import * as React from 'react';
import { StreamingServerSelector } from './StreamingServerSelector';
import { LanguageSelector } from './LanguageSelector';

interface PlayerControllerProps {
  activeServerId: string;
  onServerChange: (serverId: string) => void;
}

export const PlayerController: React.FC<PlayerControllerProps> = ({
  activeServerId,
  onServerChange,
}) => {
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
    </div>
  );
};
