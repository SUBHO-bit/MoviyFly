import * as React from 'react';
import { ChevronDown, Calendar, Layers } from 'lucide-react';

interface SeasonSelectorProps {
  totalSeasons: number;
  currentSeason: number;
  onSeasonChange: (season: number) => void;
}

export const SeasonSelector: React.FC<SeasonSelectorProps> = ({
  totalSeasons,
  currentSeason,
  onSeasonChange,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const seasonsArray = Array.from({ length: totalSeasons || 1 }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.04] pb-5 pt-2" id="watch-season-selector-wrapper">
      <div className="flex items-center gap-2.5 text-left">
        <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
          <Layers className="h-4.5 w-4.5" />
        </div>
        <div className="space-y-0.5">
          <h2 className="text-lg font-black text-white tracking-tight">
            Episode Guide
          </h2>
          <p className="text-xs text-text-muted font-medium">
            Select a season and choose an episode to start streaming.
          </p>
        </div>
      </div>

      <div className="relative shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between gap-3 px-5 py-2.5 rounded-xl bg-[#141419] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.1] text-xs font-bold text-white transition-all cursor-pointer min-w-[160px] select-none"
          id="btn-watch-season-dropdown"
        >
          <span>Season {currentSeason}</span>
          <ChevronDown className={`h-4 w-4 text-text-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-full min-w-[160px] bg-[#141419] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-30 animate-fade-in">
            <div className="max-h-[200px] overflow-y-auto custom-scroll-area py-1.5">
              {seasonsArray.map((seasonNum) => (
                <button
                  key={seasonNum}
                  onClick={() => {
                    onSeasonChange(seasonNum);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                    currentSeason === seasonNum
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  Season {seasonNum}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
