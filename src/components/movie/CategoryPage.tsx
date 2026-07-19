import * as React from 'react';
import { ArrowLeft, SlidersHorizontal, Trash2, ArrowUpDown, HelpCircle, Film, RefreshCw, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { MovieCard, MovieData } from './MovieCard';
import { movieService } from '../../services/movie.service';
import { tvService } from '../../services/tv.service';
import { navigate } from '../../lib/router';
import { Container } from '../ui/Container';

interface CategoryPageProps {
  categorySlug: string;
  watchlist: Record<string, boolean>;
  onToggleWatchlist: (movie: MovieData) => void;
  collapsed?: boolean;
}

interface CategoryConfig {
  title: string;
  description: string;
  fetcher: (page: number) => Promise<MovieData[]>;
}

const CATEGORY_MAP: Record<string, CategoryConfig> = {
  'trending-in-india': {
    title: '🔥 Trending in India',
    description: 'The hottest Bollywood, Tollywood, and Kollywood cinematic releases dominating the nation.',
    fetcher: async (page) => {
      const [b, s] = await Promise.all([
        movieService.getBollywoodMovies(page),
        movieService.getSouthIndianMovies(page)
      ]);
      const mixed: MovieData[] = [];
      const maxLen = Math.max(b.length, s.length);
      for (let i = 0; i < maxLen; i++) {
        if (b[i]) mixed.push(b[i]);
        if (s[i]) mixed.push(s[i]);
      }
      return mixed;
    }
  },
  'trending-worldwide': {
    title: '🎬 Trending Worldwide',
    description: 'Global blockbusters, crossover cinema, and top streaming releases around the globe.',
    fetcher: async (page) => {
      const [h, a, k, p] = await Promise.all([
        movieService.getHollywoodMovies(page),
        tvService.getAnime(page),
        tvService.getKDramas(page),
        tvService.getPremiumPlatformTV(page)
      ]);
      const mixed: MovieData[] = [];
      const maxLen = Math.max(h.length, a.length, k.length, p.length);
      for (let i = 0; i < maxLen; i++) {
        if (h[i]) mixed.push(h[i]);
        if (a[i]) mixed.push(a[i]);
        if (k[i]) mixed.push(k[i]);
        if (p[i]) mixed.push(p[i]);
      }
      return mixed;
    }
  },
  'bollywood-blockbusters': {
    title: '🇮🇳 Bollywood Blockbusters',
    description: 'Epic dramas, high-octane action, and sweeping romances straight from Mumbai.',
    fetcher: (page) => movieService.getBollywoodMovies(page)
  },
  'south-indian-hits': {
    title: '🎥 South Indian Hits',
    description: 'Superstar spectacles, path-breaking stories, and box office record-breakers from Tamil, Telugu, Malayalam, and Kannada.',
    fetcher: (page) => movieService.getSouthIndianMovies(page)
  },
  'hindi-dubbed-movies': {
    title: '🍿 Hindi Dubbed Movies',
    description: 'International megahits, breathtaking anime, and global blockbusters dubbed in Hindi.',
    fetcher: async (page) => {
      const [h, a] = await Promise.all([
        movieService.getHollywoodMovies(page),
        tvService.getAnime(page)
      ]);
      const combined = [...h, ...a];
      return combined.map(m => ({
        ...m,
        title: m.title.endsWith('(Hindi Dubbed)') ? m.title : `${m.title} (Hindi Dubbed)`
      }));
    }
  },
  'popular-movies': {
    title: '⭐ Popular Movies',
    description: 'The most popular films trending among viewers today.',
    fetcher: (page) => movieService.getPopularMovies(page)
  },
  'top-rated': {
    title: '🏆 Top Rated Movies',
    description: 'Critically acclaimed masterpieces ranked highest by film enthusiasts worldwide.',
    fetcher: (page) => movieService.getTopRatedMovies(page)
  },
  'new-releases': {
    title: '🆕 New Releases',
    description: 'The latest theatrical releases, premium digital premieres, and streaming launches.',
    fetcher: (page) => movieService.getNowPlayingMovies(page)
  },
  'popular-tv-shows': {
    title: '📺 Popular TV Shows',
    description: 'Top-rated television serials and web series trending on the airwaves.',
    fetcher: (page) => tvService.getWeeklyTrendingTV(page)
  },
  'trending-web-series': {
    title: '🔥 Trending Web Series',
    description: 'Highly acclaimed original series from Netflix, Prime, HBO, Disney+, and Apple TV+.',
    fetcher: (page) => tvService.getPremiumPlatformTV(page)
  },
  'anime-collection': {
    title: '🎌 Anime Collection',
    description: 'Legendary anime series, breathtaking animated films, and hot seasonal releases.',
    fetcher: (page) => tvService.getAnime(page)
  },
  'korean-dramas': {
    title: '🇰🇷 Korean Dramas',
    description: 'Captivating romantic comedies, intense thrillers, and award-winning Hallyu wave series.',
    fetcher: (page) => tvService.getKDramas(page)
  },
  'crime-thrillers': {
    title: '🎭 Crime Thrillers',
    description: 'Edge-of-your-seat suspense, mind-bending mysteries, and gritty crime sagas.',
    fetcher: (page) => movieService.getMoviesByGenre(80, page)
  },
  'comedy': {
    title: '😂 Comedy',
    description: 'Hilarious comedies, feel-good family stories, and witty satirical dramas.',
    fetcher: (page) => movieService.getMoviesByGenre(35, page)
  },
  'romance': {
    title: '❤️ Romance',
    description: 'Heartwarming romances, epic love stories, and beautiful modern-day relationships.',
    fetcher: (page) => movieService.getMoviesByGenre(10749, page)
  },
  'horror': {
    title: '👻 Horror',
    description: 'Chilling supernatural horror, psychological thrillers, and heart-pounding monster movies.',
    fetcher: (page) => movieService.getMoviesByGenre(27, page)
  },
  'scifi': {
    title: '🚀 Sci-Fi & Fantasy',
    description: 'Spectacular futuristic science-fiction, alternate universes, and magical high fantasy.',
    fetcher: (page) => movieService.getMoviesByGenre(878, page)
  },
  'airing-today-tv': {
    title: '📺 Airing Today',
    description: 'Television series airing new episodes today.',
    fetcher: (page) => tvService.getAiringToday(page)
  },
  'top-rated-tv': {
    title: '⭐ Top Rated Series',
    description: 'Critically acclaimed television series ranked highest by viewers.',
    fetcher: (page) => tvService.getTopRatedTV(page)
  },
  'indian-tv': {
    title: '🇮🇳 Indian Web Series',
    description: 'Premium Indian television series and web originals across multiple languages.',
    fetcher: (page) => tvService.getIndianTVSeries(page)
  },
  'international-tv': {
    title: '🌍 International Series',
    description: 'Top-rated international television series and dramas from around the globe.',
    fetcher: (page) => tvService.getInternationalTVSeries(page)
  },
  'netflix-originals': {
    title: '🎬 Netflix Originals',
    description: 'Premium television originals produced and distributed by Netflix.',
    fetcher: (page) => tvService.getNetflixOriginals(page)
  },
  'apple-tv-originals': {
    title: '🍎 Apple TV+',
    description: 'Highly acclaimed original television series from Apple TV+.',
    fetcher: (page) => tvService.getAppleTVOriginals(page)
  },
  'hbo-originals': {
    title: '🔥 HBO Originals',
    description: 'Groundbreaking, award-winning original series from the Home Box Office.',
    fetcher: (page) => tvService.getHBOOriginals(page)
  },
  'disney-originals': {
    title: '👑 Disney+ Originals',
    description: 'Magical original series and premium exclusives from Disney+.',
    fetcher: (page) => tvService.getDisneyOriginals(page)
  },
  'prime-originals': {
    title: '🎯 Prime Video Originals',
    description: 'Binge-worthy original television series produced by Amazon Prime Video.',
    fetcher: (page) => tvService.getPrimeOriginals(page)
  },
  'scifi-tv': {
    title: '🚀 Sci-Fi Series',
    description: 'Spectacular futuristic science-fiction, fantasy, and adventure television series.',
    fetcher: (page) => tvService.getSciFiSeries(page)
  },
  'horror-tv': {
    title: '👻 Horror Series',
    description: 'Chilling paranormal encounters, intense psychological suspense, and monster series.',
    fetcher: (page) => tvService.getHorrorSeries(page)
  },
  'comedy-tv': {
    title: '😂 Comedy Series',
    description: 'Hilarious sitcoms, witty comedy dramas, and funny talk show series.',
    fetcher: (page) => tvService.getComedySeries(page)
  },
  'crime-mystery-tv': {
    title: '🕵 Crime & Mystery',
    description: 'Gripping crime procedurals, edge-of-your-seat detective shows, and noir mysteries.',
    fetcher: (page) => tvService.getCrimeMysterySeries(page)
  },
  'romance-tv': {
    title: '❤️ Romance Series',
    description: 'Heartfelt relationship dramas, sweeps of romance, and emotional love stories.',
    fetcher: (page) => tvService.getRomanceSeries(page)
  },
  'action-tv': {
    title: '⚔ Action Series',
    description: 'High-octane television thrillers, martial arts, and military adventure series.',
    fetcher: (page) => tvService.getActionSeries(page)
  },
};

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug,
  watchlist,
  onToggleWatchlist,
  collapsed = false,
}) => {
  const [movies, setMovies] = React.useState<MovieData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);

  // Filter States
  const [sortBy, setSortBy] = React.useState<'popularity' | 'year' | 'rating'>('popularity');
  const [filterLang, setFilterLang] = React.useState<string>('all');
  const [filterYear, setFilterYear] = React.useState<string>('all');
  const [filterRating, setFilterRating] = React.useState<string>('all');

  const bottomRef = React.useRef<HTMLDivElement>(null);
  const config = CATEGORY_MAP[categorySlug];

  // Reset page when slug changes
  React.useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
    setLoading(true);
    setError(null);
  }, [categorySlug]);

  const loadPageData = React.useCallback(async (pageNum: number, isMore: boolean) => {
    if (!config) {
      setError(`Category "${categorySlug}" not found.`);
      setLoading(false);
      return;
    }

    try {
      if (isMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      let newMovies = await config.fetcher(pageNum);
      
      // If any item is a TV show, map estimated seasons to runtime
      newMovies = newMovies.map(m => {
        if (m.id.startsWith('tv-') && (!m.runtime || !m.runtime.toLowerCase().includes('season'))) {
          const getSeasonsByTitleLocal = (title: string, popularity: number = 0): string => {
            const lower = title.toLowerCase();
            if (lower.includes('breaking bad')) return '5 Seasons';
            if (lower.includes('better call saul')) return '6 Seasons';
            if (lower.includes('peaky blinders')) return '6 Seasons';
            if (lower.includes('stranger things')) return '4 Seasons';
            if (lower.includes('the boys')) return '4 Seasons';
            if (lower.includes('the bear')) return '3 Seasons';
            if (lower.includes('mirzapur')) return '3 Seasons';
            if (lower.includes('panchayat')) return '3 Seasons';
            if (lower.includes('aarya')) return '3 Seasons';
            if (lower.includes('dark')) return '3 Seasons';
            if (lower.includes('the witcher')) return '3 Seasons';
            if (lower.includes('daredevil')) return '3 Seasons';
            if (lower.includes('the family man')) return '2 Seasons';
            if (lower.includes('special ops')) return '2 Seasons';
            if (lower.includes('asur')) return '2 Seasons';
            if (lower.includes('delhi crime')) return '2 Seasons';
            if (lower.includes('rocket boys')) return '2 Seasons';
            if (lower.includes('house of the dragon')) return '2 Seasons';
            if (lower.includes('loki')) return '2 Seasons';
            if (lower.includes('the white lotus')) return '2 Seasons';
            if (lower.includes('wednesday')) return '1 Season';
            if (lower.includes('the last of us')) return '1 Season';
            if (lower.includes('severance')) return '1 Season';
            if (lower.includes('the sandman')) return '1 Season';
            if (lower.includes('kohrra')) return '1 Season';
            if (lower.includes('the railway men')) return '1 Season';
            if (lower.includes('khakee')) return '1 Season';
            if (lower.includes('the night manager')) return '1 Season';
            
            if (popularity > 300) return '4 Seasons';
            if (popularity > 150) return '3 Seasons';
            if (popularity > 80) return '2 Seasons';
            return '1 Season';
          };
          return {
            ...m,
            runtime: getSeasonsByTitleLocal(m.title, m.popularity || 0)
          };
        }
        return m;
      });
      
      if (newMovies.length === 0) {
        setHasMore(false);
      } else {
        setMovies((prev) => {
          // Prevent duplicates by ID
          const existingIds = new Set(prev.map(m => m.id));
          const filtered = newMovies.filter(m => !existingIds.has(m.id));
          return [...prev, ...filtered];
        });
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Error occurred while loading cinematic data.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [categorySlug, config]);

  // Load first page or page shifts
  React.useEffect(() => {
    loadPageData(page, page > 1);
  }, [page, categorySlug, loadPageData]);

  // Infinite Scroll Trigger
  React.useEffect(() => {
    if (loading || loadingMore || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { rootMargin: '250px 0px' }
    );

    const currentRef = bottomRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loading, loadingMore, hasMore]);

  const handleResetFilters = () => {
    setSortBy('popularity');
    setFilterLang('all');
    setFilterYear('all');
    setFilterRating('all');
  };

  // Compute Sorted and Filtered Movies
  const processedMovies = React.useMemo(() => {
    let result = [...movies];

    // 1. Language Filtering
    if (filterLang !== 'all') {
      const matchLang = filterLang.toUpperCase();
      result = result.filter(m => {
        const itemLang = String(m.language || '').toUpperCase();
        if (matchLang === 'TE|TA|ML|KN') {
          return ['TE', 'TA', 'ML', 'KN'].includes(itemLang);
        }
        return itemLang === matchLang;
      });
    }

    // 2. Year Filtering
    if (filterYear !== 'all') {
      if (filterYear === '2020s') {
        result = result.filter(m => {
          const y = parseInt(String(m.year || '0'));
          return y >= 2020 && y <= 2029;
        });
      } else if (filterYear === '2010s') {
        result = result.filter(m => {
          const y = parseInt(String(m.year || '0'));
          return y >= 2010 && y <= 2019;
        });
      } else {
        result = result.filter(m => String(m.year) === filterYear);
      }
    }

    // 3. Rating Filtering
    if (filterRating !== 'all') {
      const minRating = parseFloat(filterRating);
      result = result.filter(m => parseFloat(String(m.rating || '0')) >= minRating);
    }

    // 4. Sorting
    if (sortBy === 'year') {
      result.sort((a, b) => {
        const yearA = parseInt(String(a.year || '0').replace(/\D/g, '')) || 0;
        const yearB = parseInt(String(b.year || '0').replace(/\D/g, '')) || 0;
        return yearB - yearA;
      });
    } else if (sortBy === 'rating') {
      result.sort((a, b) => {
        const ratingA = parseFloat(String(a.rating || '0')) || 0;
        const ratingB = parseFloat(String(b.rating || '0')) || 0;
        return ratingB - ratingA;
      });
    }

    return result;
  }, [movies, sortBy, filterLang, filterYear, filterRating]);

  if (!config && error) {
    return (
      <Container size="md" className="py-24 text-center">
        <div className="max-w-md mx-auto p-8 rounded-2xl bg-[#13131A] border border-white/5 shadow-2xl">
          <HelpCircle className="h-16 w-16 text-red-500 mx-auto mb-6 animate-pulse" />
          <h2 className="text-xl font-bold text-white mb-2">Category Not Found</h2>
          <p className="text-xs text-[#B3B3B8] mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white font-bold text-xs hover:opacity-95"
          >
            Back to Home
          </button>
        </div>
      </Container>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col gap-8 text-white">
      {/* Header Info Block */}
      <div className="flex flex-col gap-3.5 border-b border-white/[0.04] pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="h-10 w-10 rounded-full border border-white/10 flex items-center justify-center text-[#B3B3B8] hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            aria-label="Back to home"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="h-6 w-1.5 rounded-full bg-[#8B5CF6]" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight uppercase leading-none">
            {config?.title || 'Category View'}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#B3B3B8] max-w-3xl leading-relaxed pl-1">
          {config?.description || 'Browse our highly curated list of premium digital streaming titles.'}
        </p>
      </div>

      {/* Filter and Control Glassmorphism Bar */}
      <div className="w-full bg-[#13131A]/40 border border-white/[0.06] rounded-[24px] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md select-none">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#B3B3B8]">
            <SlidersHorizontal className="h-3.5 w-3.5 text-[#8B5CF6]" />
            <span>Filters:</span>
          </div>

          {/* Language filter selector */}
          <div className="relative">
            <select
              value={filterLang}
              onChange={(e) => setFilterLang(e.target.value)}
              className="bg-[#181822] border border-white/10 hover:border-white/20 rounded-xl px-3 py-1.5 text-xs text-white outline-none cursor-pointer select-none font-medium"
            >
              <option value="all">All Languages</option>
              <option value="hi">Hindi (Bollywood)</option>
              <option value="en">English (Hollywood)</option>
              <option value="te|ta|ml|kn">South Indian</option>
              <option value="ko">Korean (Hallyu)</option>
              <option value="ja">Japanese</option>
            </select>
          </div>

          {/* Year filter selector */}
          <div className="relative">
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="bg-[#181822] border border-white/10 hover:border-white/20 rounded-xl px-3 py-1.5 text-xs text-white outline-none cursor-pointer select-none font-medium"
            >
              <option value="all">All Years</option>
              <option value="2026">2026 Releases</option>
              <option value="2025">2025 Releases</option>
              <option value="2024">2024 Releases</option>
              <option value="2023">2023 Releases</option>
              <option value="2022">2022 Releases</option>
              <option value="2020s">2020s Decade</option>
              <option value="2010s">2010s Decade</option>
            </select>
          </div>

          {/* Rating filter selector */}
          <div className="relative">
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="bg-[#181822] border border-white/10 hover:border-white/20 rounded-xl px-3 py-1.5 text-xs text-white outline-none cursor-pointer select-none font-medium"
            >
              <option value="all">All Ratings</option>
              <option value="8">8.0+ Rated</option>
              <option value="7">7.0+ Rated</option>
              <option value="6">6.0+ Rated</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3.5 border-t border-white/5 pt-3.5 md:pt-0 md:border-t-0">
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="h-3.5 w-3.5 text-[#8B5CF6]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#181822] border border-white/10 hover:border-white/20 rounded-xl px-3 py-1.5 text-xs text-white outline-none cursor-pointer select-none font-medium"
            >
              <option value="popularity">Popularity</option>
              <option value="year">Release Year</option>
              <option value="rating">IMDb Rating</option>
            </select>
          </div>

          {(filterLang !== 'all' || filterYear !== 'all' || filterRating !== 'all' || sortBy !== 'popularity') && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EF4444]/30 hover:border-[#EF4444]/50 bg-[#EF4444]/5 text-[#EF4444] text-[11px] font-bold uppercase tracking-wider hover:bg-[#EF4444]/10 active:scale-95 transition-all cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Movie Content Grid */}
      {loading && movies.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 w-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-[310px] sm:h-[360px] md:h-[390px] w-full bg-[#18181C] border border-white/[0.04] rounded-[24px] animate-pulse flex flex-col justify-between p-3.5"
            >
              <div className="w-full h-[70%] bg-white/[0.01] rounded-2xl animate-pulse" />
              <div className="flex flex-col gap-2 mt-4">
                <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
                <div className="h-3 w-1/2 bg-white/5 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : processedMovies.length === 0 ? (
        <div className="w-full py-28 flex flex-col items-center justify-center text-center">
          <div className="p-8 rounded-2xl bg-[#13131A] border border-white/5 max-w-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#8B5CF6]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="mx-auto h-16 w-16 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center mb-6 shadow-purple-glow">
              <Film className="h-7 w-7 text-[#8B5CF6]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Titles Match Filters</h3>
            <p className="text-xs text-[#B3B3B8] leading-relaxed mb-6">
              We couldn't find any content matching your active filters. Try resetting the filters or tweaking your selections to explore more titles.
            </p>
            <button
              onClick={handleResetFilters}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#A855F7] text-white font-bold text-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset All Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-10 w-full pb-16">
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 w-full"
          >
            <AnimatePresence mode="popLayout">
              {processedMovies.map((movie) => {
                const movieIdStr = String(movie.id);
                const rawId = movieIdStr.replace('movie-', '').replace('tv-', '');
                const isInWatchlist = !!(
                  watchlist[movieIdStr] ||
                  watchlist[rawId] ||
                  watchlist[`movie-${rawId}`] ||
                  watchlist[`tv-${rawId}`]
                );
                return (
                  <motion.div
                    key={movie.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MovieCard
                      movie={movie}
                      isInWatchlist={isInWatchlist}
                      onPlay={(m) => {
                      if (String(m.id).startsWith('tv-')) {
                        navigate(`/tv/${m.id}`);
                      } else {
                        navigate(`/movie/${m.id}`);
                      }
                    }}
                    onMoreInfo={(m) => {
                      if (String(m.id).startsWith('tv-')) {
                        navigate(`/tv/${m.id}`);
                      } else {
                        navigate(`/movie/${m.id}`);
                      }
                    }}
                    onToggleWatchlist={onToggleWatchlist}
                  />
                </motion.div>
              );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Loading Indicator or End of Catalog marker */}
          <div ref={bottomRef} className="w-full py-6 flex justify-center">
            {loadingMore ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-[#13131A] border border-white/5 rounded-full shadow-lg">
                <Loader2 className="h-4 w-4 animate-spin text-[#8B5CF6]" />
                <span className="text-xs text-[#B3B3B8] font-bold">Fetching more cinematic releases...</span>
              </div>
            ) : !hasMore ? (
              <span className="text-xs text-[#B3B3B8]/40 font-semibold tracking-widest uppercase">
                🏁 You've reached the end of this catalog
              </span>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
