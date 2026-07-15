import * as React from 'react';
import { Film, Tv, User, Search, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';

export interface SuggestionItem {
  id: string; // 'movie-123' or 'tv-456'
  title: string;
  year: string;
  type: 'movie' | 'tv' | 'person';
  poster: string;
}

interface SearchSuggestionsProps {
  suggestions: SuggestionItem[];
  selectedIndex: number;
  onSelectSuggestion: (item: SuggestionItem) => void;
  onHoverSuggestion: (index: number) => void;
  history?: string[];
  onSelectHistory?: (term: string) => void;
}

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  suggestions,
  selectedIndex,
  onSelectSuggestion,
  onHoverSuggestion,
  history = [],
  onSelectHistory,
}) => {
  const showHistory = suggestions.length === 0 && history.length > 0;

  if (suggestions.length === 0 && !showHistory) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 mt-2 bg-[#13131A] border border-white/[0.08] shadow-2xl rounded-2xl overflow-hidden z-50 text-left select-none max-h-[420px] overflow-y-auto custom-scroll-area"
      id="search-suggestions-dropdown"
    >
      {/* 1. History mode if no search suggestions exist but we have history */}
      {showHistory && (
        <div className="p-3">
          <div className="flex items-center gap-2 px-3 py-1.5 text-[10px] font-black text-text-muted uppercase tracking-widest">
            <TrendingUp className="h-3 w-3 text-primary" />
            <span>Recent Searches</span>
          </div>
          <div className="mt-1 space-y-0.5">
            {history.slice(0, 5).map((term, idx) => (
              <div
                key={idx}
                onMouseDown={() => onSelectHistory?.(term)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-white/[0.03] text-xs font-bold text-text-secondary hover:text-white transition-all cursor-pointer"
              >
                <Search className="h-3.5 w-3.5 text-text-muted shrink-0" />
                <span>{term}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Suggestions list */}
      {suggestions.length > 0 && (
        <div className="p-2 space-y-0.5" id="suggestions-list">
          <div className="px-3 py-2 text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-white/[0.03] mb-1 flex items-center justify-between">
            <span>Suggested Titles</span>
            <span className="text-[9px] lowercase font-normal text-text-muted">Use keys ↑↓ & ↵ to navigate</span>
          </div>

          {suggestions.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <div
                key={`${item.type}-${item.id}-${idx}`}
                onMouseEnter={() => onHoverSuggestion(idx)}
                onMouseDown={() => onSelectSuggestion(item)}
                className={`flex items-center gap-3.5 px-3 py-2 rounded-xl transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-[#8B5CF6]/15 border-l-[3px] border-[#8B5CF6] text-white pl-2'
                    : 'hover:bg-white/[0.02] text-text-secondary border-l-[3px] border-transparent'
                }`}
              >
                {/* Visual Thumbnail */}
                <div className="h-11 w-8 rounded-md overflow-hidden bg-white/5 shrink-0 border border-white/[0.04]">
                  <img
                    src={item.poster}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow min-w-0">
                  <h5 className="text-xs font-extrabold text-white truncate leading-snug">
                    {item.title}
                  </h5>
                  <div className="flex items-center gap-2 mt-0.5">
                    {/* Media type tag */}
                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-text-muted uppercase">
                      {item.type === 'movie' ? (
                        <Film className="h-2.5 w-2.5 text-primary" />
                      ) : item.type === 'tv' ? (
                        <Tv className="h-2.5 w-2.5 text-accent" />
                      ) : (
                        <User className="h-2.5 w-2.5 text-yellow-500" />
                      )}
                      <span>{item.type === 'movie' ? 'Movie' : item.type === 'tv' ? 'TV Show' : 'Cast'}</span>
                    </span>

                    {/* Release Year */}
                    {item.year && item.year !== 'N/A' && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-white/10" />
                        <span className="text-[10px] font-bold text-text-muted">{item.year}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
