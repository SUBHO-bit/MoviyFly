import * as React from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';
import { fetchFromTMDB } from '../../lib/api/tmdb';
import { getPosterUrl } from '../../config/tmdb';
import { navigate } from '../../lib/router';
import { SearchSuggestions, SuggestionItem } from '../search/SearchSuggestions';

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  isLoading?: boolean;
  variant?: 'default' | 'glass';
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onClear,
  isLoading = false,
  variant = 'default',
  autoFocus = false,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<SuggestionItem[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [history, setHistory] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Load search history for suggestions dropdown
  React.useEffect(() => {
    const saved = localStorage.getItem('moviyfly_search_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [isFocused]);

  // Fetch suggestions from TMDB multi-search
  React.useEffect(() => {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setSelectedIndex(-1);
      return;
    }

    let active = true;
    const fetchSuggestions = async () => {
      setLoadingSuggestions(true);
      try {
        const data = await fetchFromTMDB<{ results: any[] }>('/search/multi', {
          query: trimmed,
          page: 1,
        });

        if (!active) return;

        // Map first 8 items
        const items: SuggestionItem[] = data.results
          .slice(0, 8)
          .map((item) => {
            if (item.media_type === 'movie') {
              return {
                id: `movie-${item.id}`,
                title: item.title || item.original_title || 'Untitled Movie',
                year: item.release_date ? item.release_date.split('-')[0] : 'N/A',
                type: 'movie' as const,
                poster: getPosterUrl(item.poster_path),
              };
            } else if (item.media_type === 'tv') {
              return {
                id: `tv-${item.id}`,
                title: item.name || item.original_name || 'Untitled Show',
                year: item.first_air_date ? item.first_air_date.split('-')[0] : 'N/A',
                type: 'tv' as const,
                poster: getPosterUrl(item.poster_path),
              };
            } else if (item.media_type === 'person') {
              return {
                id: `person-${item.id}`,
                title: item.name || 'Unknown Cast',
                year: '',
                type: 'person' as const,
                poster: getPosterUrl(item.profile_path),
              };
            }
            return null;
          })
          .filter((item): item is SuggestionItem => item !== null);

        setSuggestions(items);
        setSelectedIndex(-1);
      } catch (err) {
        console.error('Failed to load suggestions:', err);
      } finally {
        if (active) {
          setLoadingSuggestions(false);
        }
      }
    };

    const delay = setTimeout(() => {
      fetchSuggestions();
    }, 250);

    return () => {
      active = false;
      clearTimeout(delay);
    };
  }, [value]);

  const handleClear = () => {
    onChange('');
    setSuggestions([]);
    setSelectedIndex(-1);
    if (onClear) onClear();
    inputRef.current?.focus();
  };

  // Keyboard Navigation Handlers
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (suggestions.length > 0 ? Math.min(prev + 1, suggestions.length - 1) : -1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else {
        // Trigger full search page navigation
        const trimmed = value.trim();
        if (trimmed) {
          navigate(`/search?q=${encodeURIComponent(trimmed)}`);
          inputRef.current?.blur();
        }
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setSuggestions([]);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleSelectSuggestion = (item: SuggestionItem) => {
    setSuggestions([]);
    setSelectedIndex(-1);
    setIsFocused(false);
    inputRef.current?.blur();

    // Reset value if it's a direct navigation
    onChange('');

    if (item.type === 'movie') {
      navigate(`/movie/${item.id}`);
    } else if (item.type === 'tv') {
      navigate(`/tv/${item.id}`);
    } else {
      // Cast member: Go to search results with that cast name
      onChange(item.title);
      navigate(`/search?q=${encodeURIComponent(item.title)}`);
    }
  };

  const handleSelectHistoryTerm = (term: string) => {
    onChange(term);
    navigate(`/search?q=${encodeURIComponent(term)}`);
    setSuggestions([]);
    setIsFocused(false);
    inputRef.current?.blur();
  };

  // Trigger auto search navigation from other pages
  const handleInputChange = (newVal: string) => {
    onChange(newVal);

    if (window.location.pathname !== '/search' && newVal.trim().length >= 2) {
      navigate(`/search?q=${encodeURIComponent(newVal)}`);
    }
  };

  return (
    <div className="relative w-full" id="search-bar-outer-container">
      <div
        className={cn(
          'w-full transition-all duration-200 relative flex items-center px-4 select-none',
          variant === 'glass'
            ? 'h-[52px] rounded-full border border-white/[0.08] bg-[#14141A]/55 backdrop-blur-[20px]'
            : 'h-[46px] rounded-xl border border-white/[0.06] bg-[#17171C] hover:bg-white/[0.02]',
          isFocused || suggestions.length > 0
            ? variant === 'glass'
              ? 'border-primary/40 shadow-[0_0_15px_rgba(139,92,246,0.25)] bg-[#14141A]/70'
              : 'border-[#8B5CF6] shadow-purple-glow bg-[#18181E]'
            : ''
        )}
      >
        {/* Search icon / loader */}
        <div className="shrink-0 mr-3 flex items-center justify-center">
          {isLoading || loadingSuggestions ? (
            <Loader2 className="h-4.5 w-4.5 text-[#8B5CF6] animate-spin" />
          ) : (
            <Search
              className={cn(
                'h-4.5 w-4.5 transition-colors duration-200 text-text-muted',
                isFocused ? 'text-[#8B5CF6]' : 'text-text-muted'
              )}
              strokeWidth={1.5}
            />
          )}
        </div>

        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            // Delay closing so that onMouseDown clicks inside Suggestions can succeed
            setTimeout(() => {
              setIsFocused(false);
            }, 200);
          }}
          placeholder="Search movies, TV shows or actors..."
          className="flex-grow bg-transparent text-[14px] text-white placeholder:text-text-muted focus:outline-none focus:ring-0 py-1.5 h-full"
          aria-label="Search movies, TV shows or actors"
        />

        {/* Clear input button */}
        {value && (
          <button
            onClick={handleClear}
            className="shrink-0 p-1.5 rounded-lg text-text-muted hover:text-white hover:bg-white/[0.04] transition-all cursor-pointer outline-none"
            aria-label="Clear search query"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Suggestion & History Dropdown */}
      {isFocused && (
        <SearchSuggestions
          suggestions={suggestions}
          selectedIndex={selectedIndex}
          onSelectSuggestion={handleSelectSuggestion}
          onHoverSuggestion={setSelectedIndex}
          history={history}
          onSelectHistory={handleSelectHistoryTerm}
        />
      )}
    </div>
  );
};
