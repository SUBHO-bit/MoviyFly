import * as React from 'react';
import { History, X, Trash2 } from 'lucide-react';

interface RecentSearchesProps {
  history: string[];
  onSelectSearch: (query: string) => void;
  onRemoveSearch: (query: string) => void;
  onClearHistory: () => void;
}

export const RecentSearches: React.FC<RecentSearchesProps> = ({
  history,
  onSelectSearch,
  onRemoveSearch,
  onClearHistory,
}) => {
  if (history.length === 0) return null;

  return (
    <div className="bg-[#141419]/90 border border-white/[0.04] rounded-2xl p-5 text-left w-full relative select-none backdrop-blur-md" id="recent-searches-block">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <h4 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Recent Searches
          </h4>
        </div>
        <button
          onClick={onClearHistory}
          className="flex items-center gap-1 text-[11px] font-black text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          id="btn-clear-history"
        >
          <Trash2 className="h-3 w-3" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {history.map((term, idx) => (
          <div
            key={`${term}-${idx}`}
            className="flex items-center bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.06] hover:border-primary/20 rounded-xl px-3.5 py-1.5 gap-2 transition-all cursor-pointer group"
          >
            <span
              onClick={() => onSelectSearch(term)}
              className="text-xs font-bold text-text-secondary group-hover:text-white transition-colors"
            >
              {term}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveSearch(term);
              }}
              className="p-0.5 rounded-md hover:bg-white/10 text-text-muted hover:text-white transition-colors cursor-pointer"
              aria-label={`Remove ${term} from search history`}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
