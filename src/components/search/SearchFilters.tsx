import * as React from 'react';
import { Filter, ChevronDown, RefreshCw, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export interface FilterState {
  mediaType: 'all' | 'movie' | 'tv';
  genreId: string; // 'all' or actual genre ID
  year: string; // 'all' or year
  language: string; // 'all' or language code
  minRating: number; // 0 to 10
  sortBy: 'popularity' | 'release_date' | 'rating' | 'title';
  sortOrder: 'desc' | 'asc';
}

interface SearchFiltersProps {
  filters: FilterState;
  onChangeFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

const LANGUAGES = [
  { code: 'all', label: 'All Languages' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
];

const GENRES = [
  { id: 'all', label: 'All Genres' },
  { id: '28', label: 'Action' },
  { id: '12', label: 'Adventure' },
  { id: '16', label: 'Animation' },
  { id: '35', label: 'Comedy' },
  { id: '80', label: 'Crime' },
  { id: '99', label: 'Documentary' },
  { id: '18', label: 'Drama' },
  { id: '14', label: 'Fantasy' },
  { id: '27', label: 'Horror' },
  { id: '10749', label: 'Romance' },
  { id: '878', label: 'Sci-Fi' },
  { id: '53', label: 'Thriller' },
];

const YEARS = [
  'all',
  '2026',
  '2025',
  '2024',
  '2023',
  '2022',
  '2021',
  '2020',
  '2019',
  '2018',
  '2015',
  '2010',
  '2005',
  '2000',
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  isOpen,
  onToggleOpen,
}) => {
  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onChangeFilters({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="w-full shrink-0 select-none" id="search-filters-container">
      {/* Filters Header toggle bar */}
      <div className="flex items-center justify-between bg-[#141419]/60 border border-white/[0.04] p-4 rounded-2xl mb-4">
        <button
          onClick={onToggleOpen}
          className="flex items-center gap-2.5 px-4 py-2 bg-[#8B5CF6]/10 text-[#A855F7] border border-[#8B5CF6]/20 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-[#8B5CF6]/20 transition-all cursor-pointer"
          id="btn-toggle-filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>{isOpen ? 'Hide Filters' : 'Show Filters'}</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Reset button */}
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-white transition-colors cursor-pointer"
            id="btn-reset-filters"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Filters Body */}
      {isOpen && (
        <div className="bg-[#141419] border border-white/[0.04] p-6 rounded-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-left mb-6 animate-fade-in" id="filters-content">
          {/* 1. Media Type */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest">
              Media Type
            </label>
            <div className="grid grid-cols-3 gap-1.5 bg-white/[0.02] p-1 rounded-xl border border-white/[0.04]">
              {(['all', 'movie', 'tv'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => updateFilter('mediaType', type)}
                  className={`py-2 text-[11px] font-extrabold rounded-lg transition-all cursor-pointer uppercase ${
                    filters.mediaType === type
                      ? 'bg-[#8B5CF6] text-white shadow-purple-glow'
                      : 'text-text-secondary hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  {type === 'all' ? 'All' : type === 'movie' ? 'Movie' : 'TV'}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Genre */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest">
              Genre Selection
            </label>
            <div className="relative">
              <select
                value={filters.genreId}
                onChange={(e) => updateFilter('genreId', e.target.value)}
                className="w-full bg-[#1A1A22] border border-white/[0.06] hover:border-white/[0.1] text-white rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] cursor-pointer appearance-none"
              >
                {GENRES.map((g) => (
                  <option key={g.id} value={g.id} className="bg-[#141419] text-white">
                    {g.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* 3. Release Year */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest">
              Release Year
            </label>
            <div className="relative">
              <select
                value={filters.year}
                onChange={(e) => updateFilter('year', e.target.value)}
                className="w-full bg-[#1A1A22] border border-white/[0.06] hover:border-white/[0.1] text-white rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] cursor-pointer appearance-none"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y} className="bg-[#141419] text-white">
                    {y === 'all' ? 'All Years' : y}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* 4. Language */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest">
              Language
            </label>
            <div className="relative">
              <select
                value={filters.language}
                onChange={(e) => updateFilter('language', e.target.value)}
                className="w-full bg-[#1A1A22] border border-white/[0.06] hover:border-white/[0.1] text-white rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] cursor-pointer appearance-none"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-[#141419] text-white">
                    {lang.label}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* 5. Minimum Rating */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest">
                Minimum Rating
              </label>
              <span className="text-[11px] font-black text-primary">
                {filters.minRating === 0 ? 'All' : `${filters.minRating.toFixed(1)}+`}
              </span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <input
                type="range"
                min="0"
                max="9"
                step="0.5"
                value={filters.minRating}
                onChange={(e) => updateFilter('minRating', parseFloat(e.target.value))}
                className="w-full accent-[#8B5CF6] h-1.5 bg-white/5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* 6. Sort By */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest">
              Sort Criteria
            </label>
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value as any)}
                className="w-full bg-[#1A1A22] border border-white/[0.06] hover:border-white/[0.1] text-white rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] cursor-pointer appearance-none"
              >
                <option value="popularity" className="bg-[#141419] text-white">Popularity</option>
                <option value="release_date" className="bg-[#141419] text-white">Newest Release</option>
                <option value="rating" className="bg-[#141419] text-white">IMDb Rating</option>
                <option value="title" className="bg-[#141419] text-white">Title (A-Z)</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                <ChevronDown className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* 7. Sort Order */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-text-muted uppercase tracking-widest">
              Sort Direction
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => updateFilter('sortOrder', 'desc')}
                className={`flex-grow py-2.5 rounded-xl border text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  filters.sortOrder === 'desc'
                    ? 'bg-[#8B5CF6] border-transparent text-white shadow-purple-glow'
                    : 'bg-[#1A1A22] border-white/[0.06] text-text-secondary hover:text-white'
                }`}
              >
                <ArrowUpDown className="h-3.5 w-3.5 rotate-180" />
                <span>Descending</span>
              </button>
              <button
                onClick={() => updateFilter('sortOrder', 'asc')}
                className={`flex-grow py-2.5 rounded-xl border text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  filters.sortOrder === 'asc'
                    ? 'bg-[#8B5CF6] border-transparent text-white shadow-purple-glow'
                    : 'bg-[#1A1A22] border-white/[0.06] text-text-secondary hover:text-white'
                }`}
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>Ascending</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
