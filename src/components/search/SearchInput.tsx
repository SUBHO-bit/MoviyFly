import * as React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  isFilterOpen?: boolean;
  onToggleFilter?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Type title, genres, actors or directors...',
  onClear,
  isFilterOpen,
  onToggleFilter,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
    inputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        'w-full bg-[#13131A]/90 border rounded-2xl flex items-center px-5 h-[56px] transition-all duration-300 relative select-none shadow-large backdrop-blur-md',
        isFocused
          ? 'border-[#8B5CF6] shadow-[#8B5CF6]/5 ring-1 ring-[#8B5CF6]/30'
          : 'border-white/[0.04] hover:bg-[#13131A]/100 hover:border-white/[0.08]'
      )}
      id="search-input-wrapper"
    >
      <Search className={cn('h-5 w-5 shrink-0 mr-4 transition-colors duration-300 text-text-muted', isFocused ? 'text-[#8B5CF6]' : 'text-text-muted')} />

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="flex-grow bg-transparent text-sm sm:text-base text-white placeholder:text-text-muted font-medium focus:outline-none focus:ring-0 py-2"
        aria-label="Refine cinematic search query"
      />

      <div className="flex items-center gap-2 shrink-0 ml-3">
        {value && (
          <button
            onClick={handleClear}
            className="p-1.5 rounded-xl hover:bg-white/5 text-text-muted hover:text-white transition-all cursor-pointer"
            aria-label="Clear query text"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {onToggleFilter && (
          <>
            <span className="h-4 w-[1px] bg-white/[0.08]" />
            <button
              onClick={onToggleFilter}
              className={cn(
                'p-2 rounded-xl border flex items-center justify-center transition-all cursor-pointer',
                isFilterOpen
                  ? 'bg-[#8B5CF6] border-transparent text-white shadow-purple-glow'
                  : 'bg-[#1A1A22] border-white/[0.06] text-text-secondary hover:text-white hover:border-white/10'
              )}
              aria-label="Toggle Advanced Filter Control Panel"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
