import * as React from 'react';
import { Play, Clapperboard, Film, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { Container } from '../ui/Container';
import { HeroBanner } from '../hero/HeroBanner';
import { MovieCard, MovieData } from '../movie/MovieCard';
import { MovieRow } from '../movie/MovieRow';
import { MovieRowSkeleton } from '../movie/MovieRowSkeleton';
import { movieService } from '../../services/movie.service';
import { tvService } from '../../services/tv.service';
import { heroService } from '../../services/hero.service';
const MovieDetailsPage = React.lazy(() => import('../movie/MovieDetailsPage').then(m => ({ default: m.MovieDetailsPage })));
const TVDetailsPage = React.lazy(() => import('../tv/TVDetailsPage').then(m => ({ default: m.TVDetailsPage })));
const SearchPage = React.lazy(() => import('../search/SearchPage').then(m => ({ default: m.SearchPage })));
const WatchPage = React.lazy(() => import('../watch/WatchPage').then(m => ({ default: m.WatchPage })));
const WatchTVPage = React.lazy(() => import('../watch/WatchTVPage').then(m => ({ default: m.WatchTVPage })));
const CategoryPage = React.lazy(() => import('../movie/CategoryPage').then(m => ({ default: m.CategoryPage })));
const MoviePage = React.lazy(() => import('../movie/MoviePage').then(m => ({ default: m.MoviePage })));
const TVShowsPage = React.lazy(() => import('../tv/TVShowsPage').then(m => ({ default: m.TVShowsPage })));

const PageLoader: React.FC = () => (
  <div className="w-full flex-grow flex flex-col items-center justify-center py-24 min-h-[400px] transition-all duration-300">
    <div className="relative flex items-center justify-center">
      {/* Outer spinning ring */}
      <div className="w-12 h-12 rounded-full border-2 border-[#8B5CF6]/10 border-t-[#8B5CF6] animate-spin" />
      {/* Inner pulsing orb */}
      <div className="absolute w-4 h-4 bg-[#A855F7]/40 rounded-full animate-ping" />
    </div>
    <span className="mt-4 text-xs font-bold text-[#B3B3B8] tracking-widest uppercase animate-pulse">
      Loading Cinematic Experience...
    </span>
  </div>
);
import { Logo } from '../common/Logo';
import { getMovieIdFromPath, getTVIdFromPath, getMovieIdFromWatchPath, getTVIdFromWatchPath, navigate, getDetailsPath } from '../../lib/router';
import { useWatchlist } from '../../context/WatchlistContext';

export interface MainContentProps {
  pageTitle: string;
  collapsed?: boolean;
}

export const MainContent: React.FC<MainContentProps> = ({ pageTitle, collapsed = false }) => {
  const { watchlist, watchlistItems: watchlistMovies, toggleWatchlist: handleToggleWatchlist } = useWatchlist();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Scroll position and tab-keeping persistence
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const scrollPositions = React.useRef<Record<string, number>>({});

  // Live collections from TMDB API
  const [heroMovies, setHeroMovies] = React.useState<MovieData[]>([]);
  const [trendingNow, setTrendingNow] = React.useState<MovieData[]>([]);
  const [trendingInIndia, setTrendingInIndia] = React.useState<MovieData[]>([]);
  const [trendingWorldwide, setTrendingWorldwide] = React.useState<MovieData[]>([]);
  const [bollywoodBlockbusters, setBollywoodBlockbusters] = React.useState<MovieData[]>([]);
  const [southIndianHits, setSouthIndianHits] = React.useState<MovieData[]>([]);
  const [hindiDubbedMovies, setHindiDubbedMovies] = React.useState<MovieData[]>([]);
  const [hollywoodHits, setHollywoodHits] = React.useState<MovieData[]>([]);
  const [trendingWebSeries, setTrendingWebSeries] = React.useState<MovieData[]>([]);
  const [animeCollection, setAnimeCollection] = React.useState<MovieData[]>([]);
  const [koreanDramas, setKoreanDramas] = React.useState<MovieData[]>([]);
  const [continueWatching, setContinueWatching] = React.useState<MovieData[]>([]);

  const seenIdsRef = React.useRef<Set<string>>(new Set());

  // Intelligent smart mixing logic helper function
  const mixMovies = React.useCallback((
    bollywood: MovieData[],
    southIndian: MovieData[],
    hollywood: MovieData[],
    other: MovieData[],
    targetLimit: number = 20
  ): MovieData[] => {
    const result: MovieData[] = [];
    const seenIds = seenIdsRef.current;
    let bIdx = 0, sIdx = 0, hIdx = 0, oIdx = 0;

    // Ratio distribution:
    // 35% Bollywood, 25% South Indian, 30% Hollywood, 10% Other
    const bTarget = Math.max(1, Math.round(targetLimit * 0.35));
    const sTarget = Math.max(1, Math.round(targetLimit * 0.25));
    const hTarget = Math.max(1, Math.round(targetLimit * 0.30));
    const oTarget = Math.max(1, Math.round(targetLimit * 0.10));

    let addedB = 0, addedS = 0, addedH = 0, addedO = 0;

    // Try to add according to target ratios without duplication
    while (result.length < targetLimit) {
      let progress = false;

      // Bollywood
      if (addedB < bTarget && bIdx < bollywood.length) {
        const m = bollywood[bIdx++];
        if (m && !seenIds.has(m.id)) {
          result.push(m);
          seenIds.add(m.id);
          addedB++;
          progress = true;
        }
      }
      // South Indian
      if (addedS < sTarget && sIdx < southIndian.length) {
        const m = southIndian[sIdx++];
        if (m && !seenIds.has(m.id)) {
          result.push(m);
          seenIds.add(m.id);
          addedS++;
          progress = true;
        }
      }
      // Hollywood
      if (addedH < hTarget && hIdx < hollywood.length) {
        const m = hollywood[hIdx++];
        if (m && !seenIds.has(m.id)) {
          result.push(m);
          seenIds.add(m.id);
          addedH++;
          progress = true;
        }
      }
      // Other
      if (addedO < oTarget && oIdx < other.length) {
        const m = other[oIdx++];
        if (m && !seenIds.has(m.id)) {
          result.push(m);
          seenIds.add(m.id);
          addedO++;
          progress = true;
        }
      }

      // If no progress (exhausted unique items matching ratio), backfill from general lists
      if (!progress) {
        const combined = [...bollywood.slice(bIdx), ...southIndian.slice(sIdx), ...hollywood.slice(hIdx), ...other.slice(oIdx)];
        for (const m of combined) {
          if (result.length >= targetLimit) break;
          if (m && !seenIds.has(m.id)) {
            result.push(m);
            seenIds.add(m.id);
          }
        }
        // Absolute fallback if everything is seen
        if (result.length < targetLimit) {
          const anyCombined = [...bollywood, ...southIndian, ...hollywood, ...other];
          for (const m of anyCombined) {
            if (result.length >= targetLimit) break;
            if (m && !result.some(r => r.id === m.id)) {
              result.push(m);
            }
          }
        }
        break;
      }
    }
    return result;
  }, []);

  // Highly optimized lazy fetch callback loaders
  const fetchPopularMoviesLazy = React.useCallback(async () => {
    const popularMoviesList = await movieService.getPopularMovies();
    return mixMovies(bollywoodBlockbusters, southIndianHits, hollywoodHits, popularMoviesList, 18);
  }, [bollywoodBlockbusters, southIndianHits, hollywoodHits, mixMovies]);

  const fetchTopRatedLazy = React.useCallback(async () => {
    const topRatedMoviesList = await movieService.getTopRatedMovies();
    const popularMoviesList = await movieService.getPopularMovies();
    return mixMovies(topRatedMoviesList, southIndianHits, hollywoodHits, popularMoviesList, 18);
  }, [southIndianHits, hollywoodHits, mixMovies]);

  const fetchNewReleasesLazy = React.useCallback(async () => {
    const nowPlayingList = await movieService.getNowPlayingMovies();
    const upcomingList = await movieService.getUpcomingMovies();
    return mixMovies(nowPlayingList, southIndianHits, hollywoodHits, upcomingList, 18);
  }, [southIndianHits, hollywoodHits, mixMovies]);

  const fetchPopularTvLazy = React.useCallback(async () => {
    const trendingTvList = await tvService.getWeeklyTrendingTV();
    const popTv = trendingTvList.filter(m => !seenIdsRef.current.has(m.id)).slice(0, 18);
    popTv.forEach(m => seenIdsRef.current.add(m.id));
    return popTv;
  }, []);

  const fetchCrimeLazy = React.useCallback(async () => {
    const crimeList = await movieService.getMoviesByGenre(80);
    return mixMovies(
      crimeList.filter(m => m.language === 'HI'),
      crimeList.filter(m => ['TE', 'TA', 'ML', 'KN'].includes(m.language)),
      crimeList.filter(m => m.language === 'EN'),
      crimeList,
      18
    );
  }, [mixMovies]);

  const fetchComedyLazy = React.useCallback(async () => {
    const comedyList = await movieService.getMoviesByGenre(35);
    return mixMovies(
      comedyList.filter(m => m.language === 'HI'),
      comedyList.filter(m => ['TE', 'TA', 'ML', 'KN'].includes(m.language)),
      comedyList.filter(m => m.language === 'EN'),
      comedyList,
      18
    );
  }, [mixMovies]);

  const fetchRomanceLazy = React.useCallback(async () => {
    const romanceList = await movieService.getMoviesByGenre(10749);
    return mixMovies(
      romanceList.filter(m => m.language === 'HI'),
      romanceList.filter(m => ['TE', 'TA', 'ML', 'KN'].includes(m.language)),
      romanceList.filter(m => m.language === 'EN'),
      romanceList,
      18
    );
  }, [mixMovies]);

  const fetchHorrorLazy = React.useCallback(async () => {
    const horrorList = await movieService.getMoviesByGenre(27);
    return mixMovies(
      horrorList.filter(m => m.language === 'HI'),
      horrorList.filter(m => ['TE', 'TA', 'ML', 'KN'].includes(m.language)),
      horrorList.filter(m => m.language === 'EN'),
      horrorList,
      18
    );
  }, [mixMovies]);

  const fetchScifiLazy = React.useCallback(async () => {
    const scifiList = await movieService.getMoviesByGenre(878);
    return mixMovies(
      scifiList.filter(m => m.language === 'HI'),
      scifiList.filter(m => ['TE', 'TA', 'ML', 'KN'].includes(m.language)),
      scifiList.filter(m => m.language === 'EN'),
      scifiList,
      18
    );
  }, [mixMovies]);

  const fetchEditorsPicksLazy = React.useCallback(async () => {
    const topRatedMoviesList = await movieService.getTopRatedMovies();
    const upcomingList = await movieService.getUpcomingMovies();
    const curators = [...topRatedMoviesList, ...upcomingList].filter(m => !seenIdsRef.current.has(m.id)).slice(0, 18);
    return curators;
  }, []);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    seenIdsRef.current = new Set();
    try {
      // Helper to fetch with a fallback to empty array on error so a single endpoint fail doesn't brick the app
      const fetchWithFallback = async <T,>(promise: Promise<T[]>, fallback: T[] = []): Promise<T[]> => {
        try {
          return await promise;
        } catch (e) {
          console.warn("Failed fetching subset:", e);
          return fallback;
        }
      };

      // Stage 1: Load essential initial viewport elements (Hero, Trending, Popular)
      const [
        detailedHero,
        trendingList,
        popularList,
      ] = await Promise.all([
        heroService.getHeroMoviePool(false),
        fetchWithFallback(movieService.getTrendingMovies()),
        fetchWithFallback(movieService.getPopularMovies()),
      ]);

      setHeroMovies(detailedHero);
      detailedHero.forEach(m => seenIdsRef.current.add(m.id));

      // --- Row 1: 🔥 Trending Now ---
      const trendNow = trendingList.filter(m => !seenIdsRef.current.has(m.id)).slice(0, 18);
      trendNow.forEach(m => seenIdsRef.current.add(m.id));
      setTrendingNow(trendNow);

      // --- Row 3: 🌍 Trending Worldwide ---
      const tWorld = popularList.filter(m => !seenIdsRef.current.has(m.id)).slice(0, 18);
      tWorld.forEach(m => seenIdsRef.current.add(m.id));
      setTrendingWorldwide(tWorld);

      // Transition loading state to false immediately so viewport renders without delay
      setLoading(false);

      // Stage 2: Deferred loading for remaining homepage rows during browser idle
      const loadStage2 = async () => {
        try {
          await Promise.allSettled([
            movieService.fetchAndSetGenres(),
            tvService.fetchAndSetTVGenres(),
          ]);

          const [
            bollywoodList,
            southIndianList,
            hollywoodList,
            premiumTvList,
            animeList,
            kdramaList,
          ] = await Promise.all([
            fetchWithFallback(movieService.getBollywoodMovies()),
            fetchWithFallback(movieService.getSouthIndianMovies()),
            fetchWithFallback(movieService.getHollywoodMovies()),
            fetchWithFallback(tvService.getPremiumPlatformTV()),
            fetchWithFallback(tvService.getAnime()),
            fetchWithFallback(tvService.getKDramas()),
          ]);

          // --- Row 2: 🇮🇳 Trending in India ---
          const tIndia: MovieData[] = [];
          const seenIndia = new Set<string>();
          let bI = 0, sI = 0;
          while (tIndia.length < 18 && (bI < bollywoodList.length || sI < southIndianList.length)) {
            if (bI < bollywoodList.length && tIndia.length < 18) {
              const m = bollywoodList[bI++];
              if (m && !seenIdsRef.current.has(m.id) && !seenIndia.has(m.id)) {
                tIndia.push(m);
                seenIndia.add(m.id);
                seenIdsRef.current.add(m.id);
              }
            }
            if (sI < southIndianList.length && tIndia.length < 18) {
              const m = southIndianList[sI++];
              if (m && !seenIdsRef.current.has(m.id) && !seenIndia.has(m.id)) {
                tIndia.push(m);
                seenIndia.add(m.id);
                seenIdsRef.current.add(m.id);
              }
            }
          }
          setTrendingInIndia(tIndia);

          // --- Row 4: 🎥 Bollywood Blockbusters ---
          const bBlockbusters = bollywoodList.filter(m => !seenIdsRef.current.has(m.id)).slice(0, 18);
          bBlockbusters.forEach(m => seenIdsRef.current.add(m.id));
          setBollywoodBlockbusters(bBlockbusters);

          // --- Row 5: 🎥 South Indian Hits ---
          const sHits = southIndianList.filter(m => !seenIdsRef.current.has(m.id)).slice(0, 18);
          sHits.forEach(m => seenIdsRef.current.add(m.id));
          setSouthIndianHits(sHits);

          // --- Row 6: 🍿 Hindi Dubbed Movies ---
          const hDubbed = [...hollywoodList, ...animeList]
            .filter(m => !seenIdsRef.current.has(m.id) && m.language !== 'HI')
            .slice(0, 18)
            .map(m => ({ ...m, title: `${m.title} (Hindi Dubbed)` }));
          hDubbed.forEach(m => seenIdsRef.current.add(m.id));
          setHindiDubbedMovies(hDubbed);

          // --- Row 10: 🍿 Hollywood Hits ---
          const hWood = hollywoodList.filter(m => !seenIdsRef.current.has(m.id)).slice(0, 18);
          hWood.forEach(m => seenIdsRef.current.add(m.id));
          setHollywoodHits(hWood);

          // --- Row 11: 🔥 Trending Web Series ---
          const pTv = premiumTvList.filter(m => !seenIdsRef.current.has(m.id)).slice(0, 18);
          pTv.forEach(m => seenIdsRef.current.add(m.id));
          setTrendingWebSeries(pTv);

          // --- Row 12: 🎌 Anime Collection ---
          const anime = animeList.filter(m => !seenIdsRef.current.has(m.id)).slice(0, 18);
          anime.forEach(m => seenIdsRef.current.add(m.id));
          setAnimeCollection(anime);

          // --- Row 13: 🇰🇷 Korean Dramas ---
          const kdrama = kdramaList.filter(m => !seenIdsRef.current.has(m.id)).slice(0, 18);
          kdrama.forEach(m => seenIdsRef.current.add(m.id));
          setKoreanDramas(kdrama);
        } catch (e) {
          console.warn("Deferred Stage 2 fetch failed:", e);
        }
      };

      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => loadStage2());
      } else {
        setTimeout(loadStage2, 120);
      }

    } catch (err: any) {
      console.error('Error fetching TMDB data:', err);
      setError(err.message || 'An error occurred while loading content from TMDB.');
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
    try {
      const stored = localStorage.getItem('moviyfly_continue_watching');
      if (stored) {
        setContinueWatching(JSON.parse(stored));
      } else {
        setContinueWatching([]);
      }
    } catch (e) {
      setContinueWatching([]);
    }
  }, [loadData]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (pageTitle) {
      scrollPositions.current[pageTitle] = target.scrollTop;
      sessionStorage.setItem(`scroll_pos_${pageTitle}`, String(target.scrollTop));
    }
  };

  React.useEffect(() => {
    if (scrollContainerRef.current && pageTitle) {
      const saved = sessionStorage.getItem(`scroll_pos_${pageTitle}`);
      const targetPos = saved ? parseInt(saved, 10) : (scrollPositions.current[pageTitle] || 0);
      
      const timer = setTimeout(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop = targetPos;
        }
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [pageTitle]);

  const handlePlayMovie = (movie: MovieData) => {
    navigate(getDetailsPath(movie.id, movie.title));
  };

  const handleMoreInfo = (movie: MovieData) => {
    navigate(getDetailsPath(movie.id, movie.title));
  };

  const isHomeOrMovies = pageTitle === 'home' || pageTitle === 'movies' || pageTitle === 'tvshows' || pageTitle === 'watchlist' || pageTitle === 'movie-details' || pageTitle === 'tv-details';

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className={cn(
        "flex-grow overflow-y-auto custom-scroll-area flex flex-col min-h-screen w-full relative transition-all duration-300",
        !isHomeOrMovies && "px-3 sm:px-6 pb-8 pt-[72px]"
      )}
    >
      <div className="flex-grow flex-1 flex flex-col w-full relative">
        {/* Conditionally rendered details, search, watch and category pages to ensure correct lifecycle mounts */}
      {pageTitle === 'watch-tv' && (
        <React.Suspense fallback={<PageLoader />}>
          <WatchTVPage
            tvId={getTVIdFromWatchPath(window.location.pathname) || ''}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        </React.Suspense>
      )}
      {pageTitle === 'watch-movie' && (
        <React.Suspense fallback={<PageLoader />}>
          <WatchPage
            movieId={getMovieIdFromWatchPath(window.location.pathname) || ''}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        </React.Suspense>
      )}
      {pageTitle === 'search' && (
        <React.Suspense fallback={<PageLoader />}>
          <SearchPage
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            onPlayMovie={handlePlayMovie}
          />
        </React.Suspense>
      )}
      {pageTitle === 'tv-details' && (
        <React.Suspense fallback={<PageLoader />}>
          <TVDetailsPage
            tvId={getTVIdFromPath(window.location.pathname) || ''}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        </React.Suspense>
      )}
      {pageTitle === 'movie-details' && (
        <React.Suspense fallback={<PageLoader />}>
          <MovieDetailsPage
            movieId={getMovieIdFromPath(window.location.pathname) || ''}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        </React.Suspense>
      )}
      {pageTitle === 'category' && (
        <React.Suspense fallback={<PageLoader />}>
          <CategoryPage
            categorySlug={window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1)}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
            collapsed={collapsed}
          />
        </React.Suspense>
      )}

      {/* Persistent Movies tab keeps loaded state & scroll position */}
      <div className={cn("w-full flex-grow flex flex-col", pageTitle === 'movies' ? "block" : "hidden")}>
        <React.Suspense fallback={<PageLoader />}>
          <MoviePage
            collapsed={collapsed}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        </React.Suspense>
      </div>

      {/* Persistent TV Shows tab keeps loaded state & scroll position */}
      <div className={cn("w-full flex-grow flex flex-col", pageTitle === 'tvshows' ? "block" : "hidden")}>
        <React.Suspense fallback={<PageLoader />}>
          <TVShowsPage
            collapsed={collapsed}
            watchlist={watchlist}
            onToggleWatchlist={handleToggleWatchlist}
          />
        </React.Suspense>
      </div>

      {/* Persistent Watchlist & Brand Design Hub tab keeps loaded state & scroll position */}
      <div className={cn("w-full flex-grow flex flex-col gap-10 px-4 sm:px-8 pt-6", pageTitle === 'watchlist' ? "block" : "hidden")}>
        <div className="space-y-2">
          <span className="text-xs text-[#8B5CF6] font-bold tracking-widest uppercase mb-1 block">Your Personal Library</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Cinema Watchlist</h1>
        </div>

        {watchlistMovies.length === 0 ? (
          <div className="p-8 md:p-12 rounded-2xl bg-white/[0.01] border border-white/5 text-center relative overflow-hidden my-6">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#8B5CF6]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="mx-auto h-12 w-12 rounded-full bg-[#8B5CF6]/10 flex items-center justify-center mb-4">
              <Clapperboard className="h-5 w-5 text-[#8B5CF6]" />
            </div>
            <h3 className="text-md font-bold text-white mb-1">Your watchlist is empty</h3>
            <p className="text-xs text-text-secondary max-w-sm mx-auto leading-relaxed">
              Tap on any movie's "Add to Watchlist" heart icon to save it here for offline/online reference.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 my-6">
            {watchlistMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onPlay={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={handleToggleWatchlist}
                isInWatchlist={true}
              />
            ))}
          </div>
        )}
      </div>

      {/* Persistent Home page tab keeps loaded state & scroll position */}
      <div className={cn("w-full flex-grow flex flex-col", pageTitle === 'home' ? "block" : "hidden")}>
        {error ? (
          <div className="flex-grow flex items-center justify-center py-28 px-4 transition-all duration-300">
            <div className="text-center max-w-md p-8 rounded-2xl bg-white/[0.01] border border-white/5 shadow-purple-glow relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-purple-glow">
                <Film className="h-7 w-7 text-primary animate-pulse" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight mb-2">Live Catalog Offline</h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-6">
                {error.includes('TMDB_READ_ACCESS_TOKEN is missing') ? (
                  <span>Your <strong>TMDB Read Access Token</strong> is missing. Please add it as an environment variable in your Secrets panel to sync live cinematic content.</span>
                ) : (
                  <span>We had trouble connecting to TMDB services: <code className="block mt-2 text-primary font-mono text-[11px] p-2 bg-white/5 rounded">{error}</code></span>
                )}
              </p>
              <button
                onClick={loadData}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-3.5 w-3.5 animate-spin-slow" />
                Retry Sync Connection
              </button>
            </div>
          </div>
        ) : loading ? (
          <div className="flex flex-col w-full">
            {/* Full-bleed Featured banner skeleton matching h-screen */}
            <div className="relative w-full h-screen bg-white/[0.01] animate-pulse flex items-center justify-center">
              <div className="text-center flex flex-col gap-3 transition-all duration-300">
                <Clapperboard className="h-10 w-10 text-primary/40 animate-bounce mx-auto" />
                <span className="text-xs text-text-muted font-bold uppercase tracking-widest">Waking Cinema Engines...</span>
              </div>
            </div>
            <div className="relative z-30 px-4 sm:px-8 pb-16 w-full flex flex-col gap-14 pt-12 md:pt-16 md:pr-8 transition-all duration-300">
              <MovieRowSkeleton />
              <MovieRowSkeleton />
              <MovieRowSkeleton />
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col">
            {/* Premium Hero Banner - Full bleed (100% width, h-screen height, zero padding) */}
            <HeroBanner movies={heroMovies} collapsed={collapsed} />

            {/* Other sections padded inside container with elegant spacing below the fullscreen Hero */}
            <div className="relative z-30 px-4 sm:px-8 pb-16 w-full flex flex-col gap-14 pt-12 md:pt-16 md:pr-8 transition-all duration-300">
              {/* Continue Watching Section */}
              {continueWatching.length > 0 && (
                <MovieRow
                  title="Continue Watching"
                  movies={continueWatching}
                  onPlayMovie={handlePlayMovie}
                  onMoreInfo={handleMoreInfo}
                  onToggleWatchlist={handleToggleWatchlist}
                  watchlist={watchlist}
                  onSeeAll={() => navigate('/watchlist')}
                />
              )}

              {/* 🔥 Trending Now */}
              {trendingNow.length > 0 && (
                <MovieRow
                  title="🔥 Trending Now"
                  movies={trendingNow}
                  onPlayMovie={handlePlayMovie}
                  onMoreInfo={handleMoreInfo}
                  onToggleWatchlist={handleToggleWatchlist}
                  watchlist={watchlist}
                  onSeeAll={() => navigate('/movies/trending-now')}
                />
              )}

              {/* 🎬 Popular Movies */}
              <MovieRow
                title="🎬 Popular Movies"
                fetchData={fetchPopularMoviesLazy}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={handleToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/popular-movies')}
              />

              {/* 📺 Trending TV Shows (Popular TV Shows) */}
              <MovieRow
                title="📺 Trending TV Shows"
                fetchData={fetchPopularTvLazy}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={handleToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/popular-tv-shows')}
              />

              {/* 🇮🇳 Trending in India */}
              {trendingInIndia.length > 0 && (
                <MovieRow
                  title="🇮🇳 Trending in India"
                  movies={trendingInIndia}
                  onPlayMovie={handlePlayMovie}
                  onMoreInfo={handleMoreInfo}
                  onToggleWatchlist={handleToggleWatchlist}
                  watchlist={watchlist}
                  onSeeAll={() => navigate('/movies/trending-in-india')}
                />
              )}

              {/* 🌍 Trending Worldwide */}
              {trendingWorldwide.length > 0 && (
                <MovieRow
                  title="🌍 Trending Worldwide"
                  movies={trendingWorldwide}
                  onPlayMovie={handlePlayMovie}
                  onMoreInfo={handleMoreInfo}
                  onToggleWatchlist={handleToggleWatchlist}
                  watchlist={watchlist}
                  onSeeAll={() => navigate('/movies/trending-worldwide')}
                />
              )}

              {/* 🍿 Hollywood Hits */}
              {hollywoodHits.length > 0 && (
                <MovieRow
                  title="🍿 Hollywood Hits"
                  movies={hollywoodHits}
                  onPlayMovie={handlePlayMovie}
                  onMoreInfo={handleMoreInfo}
                  onToggleWatchlist={handleToggleWatchlist}
                  watchlist={watchlist}
                  onSeeAll={() => navigate('/movies/hollywood-hits')}
                />
              )}

              {/* 🎥 Bollywood Blockbusters */}
              {bollywoodBlockbusters.length > 0 && (
                <MovieRow
                  title="🎥 Bollywood Blockbusters"
                  movies={bollywoodBlockbusters}
                  onPlayMovie={handlePlayMovie}
                  onMoreInfo={handleMoreInfo}
                  onToggleWatchlist={handleToggleWatchlist}
                  watchlist={watchlist}
                  onSeeAll={() => navigate('/movies/bollywood-blockbusters')}
                />
              )}

              {/* 🎥 South Indian Hits */}
              {southIndianHits.length > 0 && (
                <MovieRow
                  title="🎥 South Indian Hits"
                  movies={southIndianHits}
                  onPlayMovie={handlePlayMovie}
                  onMoreInfo={handleMoreInfo}
                  onToggleWatchlist={handleToggleWatchlist}
                  watchlist={watchlist}
                  onSeeAll={() => navigate('/movies/south-indian-hits')}
                />
              )}

              {/* 🍿 Hindi Dubbed Movies */}
              {hindiDubbedMovies.length > 0 && (
                <MovieRow
                  title="🍿 Hindi Dubbed Movies"
                  movies={hindiDubbedMovies}
                  onPlayMovie={handlePlayMovie}
                  onMoreInfo={handleMoreInfo}
                  onToggleWatchlist={handleToggleWatchlist}
                  watchlist={watchlist}
                  onSeeAll={() => navigate('/movies/hindi-dubbed-movies')}
                />
              )}

              {/* 🏆 Top Rated */}
              <MovieRow
                title="⭐ Top Rated"
                fetchData={fetchTopRatedLazy}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={handleToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/top-rated')}
              />

              {/* 🆕 New Releases */}
              <MovieRow
                title="🎞️ New Releases"
                fetchData={fetchNewReleasesLazy}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={handleToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/new-releases')}
              />

              {/* 🔥 Trending Web Series */}
              {trendingWebSeries.length > 0 && (
                <MovieRow
                  title="🔥 Trending Web Series"
                  movies={trendingWebSeries}
                  onPlayMovie={handlePlayMovie}
                  onMoreInfo={handleMoreInfo}
                  onToggleWatchlist={handleToggleWatchlist}
                  watchlist={watchlist}
                  onSeeAll={() => navigate('/movies/trending-web-series')}
                />
              )}

              {/* 🎌 Anime Collection */}
              {animeCollection.length > 0 && (
                <MovieRow
                  title="🎌 Anime"
                  movies={animeCollection}
                  onPlayMovie={handlePlayMovie}
                  onMoreInfo={handleMoreInfo}
                  onToggleWatchlist={handleToggleWatchlist}
                  watchlist={watchlist}
                  onSeeAll={() => navigate('/movies/anime-collection')}
                />
              )}

              {/* 🇰🇷 Korean Dramas */}
              {koreanDramas.length > 0 && (
                <MovieRow
                  title="🇰🇷 Korean Dramas"
                  movies={koreanDramas}
                  onPlayMovie={handlePlayMovie}
                  onMoreInfo={handleMoreInfo}
                  onToggleWatchlist={handleToggleWatchlist}
                  watchlist={watchlist}
                  onSeeAll={() => navigate('/movies/korean-dramas')}
                />
              )}

              {/* 🎭 Crime Thrillers */}
              <MovieRow
                title="🎭 Crime Thrillers"
                fetchData={fetchCrimeLazy}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={handleToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/crime-thrillers')}
              />

              {/* 😂 Comedy */}
              <MovieRow
                title="😂 Comedy"
                fetchData={fetchComedyLazy}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={handleToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/comedy')}
              />

              {/* ❤️ Romance */}
              <MovieRow
                title="❤️ Romance"
                fetchData={fetchRomanceLazy}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={handleToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/romance')}
              />

              {/* 👻 Horror */}
              <MovieRow
                title="👻 Horror"
                fetchData={fetchHorrorLazy}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={handleToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/horror')}
              />

              {/* 🚀 Sci-Fi & Fantasy */}
              <MovieRow
                title="🚀 Sci-Fi & Fantasy"
                fetchData={fetchScifiLazy}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={handleToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/scifi')}
              />

              {/* 🎯 Editor's Picks */}
              <MovieRow
                title="🎯 Editor's Picks"
                fetchData={fetchEditorsPicksLazy}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={handleToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/editors-picks')}
              />
            </div>
          </div>
        )}
      </div>

      {/* Center empty state displayed when page is not matched */}
      {!isHomeOrMovies &&
        pageTitle !== 'watch-tv' &&
        pageTitle !== 'watch-movie' &&
        pageTitle !== 'search' &&
        pageTitle !== 'tv-details' &&
        pageTitle !== 'movie-details' &&
        pageTitle !== 'category' && (
          <Container size="md" className="flex-grow flex items-center justify-center py-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center max-w-xl p-8 md:p-12 rounded-lg bg-card border border-white/5 shadow-large relative overflow-hidden"
            >
              {/* Subtle geometric overlay glow inside card */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

              {/* Central movie/media icon */}
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-purple-glow">
                <Clapperboard className="h-7 w-7 text-primary animate-pulse" />
              </div>

              {/* Title */}
              <h1 className="text-h2 font-extrabold text-white tracking-tight">
                Page Not Found
              </h1>

              {/* Content category info */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/5 text-text-secondary text-caption font-bold rounded-sm uppercase tracking-wider mt-3">
                <span>Path:</span>
                <span className="text-primary font-extrabold">{window.location.pathname}</span>
              </div>

              {/* Core placeholder text */}
              <p className="text-small text-text-secondary leading-relaxed mt-6">
                The cinematic content you are looking for does not exist or has been moved.
              </p>

              <div className="mt-8 pt-6 border-t border-white/5 flex justify-center">
                <button
                  onClick={() => navigate('/home')}
                  className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-purple-glow"
                >
                  Return to Home Cinema
                </button>
              </div>
            </motion.div>
          </Container>
        )}
      </div>

      {/* Embedded premium minimal footer */}
      <motion.footer
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full bg-[#0A0A0A] border-t border-white/[0.08] py-12 md:py-16 px-4 flex flex-col items-center justify-center text-center mt-auto z-10"
      >
        <div className="max-w-[900px] w-full flex flex-col items-center gap-6 md:gap-8 select-none">
          {/* First Line */}
          <div className="flex items-center justify-center gap-2.5 text-xs font-semibold text-text-secondary">
            <img
              src="/assets/tmdb-logo.svg"
              alt="TMDB Logo"
              className="h-3.5 w-auto object-contain brightness-95"
              referrerPolicy="no-referrer"
            />
            <span>Powered by TMDB</span>
          </div>

          {/* Second Line */}
          <div className="text-sm font-medium text-white tracking-wide">
            Made with 👽 by <span className="font-extrabold">MOVIYFLY</span>
          </div>

          {/* Third Line */}
          <p className="text-[11px] leading-[1.7] text-text-muted text-center max-w-[700px]">
            This website does not retain any files on its server. Rather, it solely provides links to media content hosted by third-party services.
          </p>

          {/* Fourth Line */}
          <div className="text-[10px] text-[#475569] text-center flex flex-col items-center gap-0.5 font-medium">
            <span>© 2026 MOVIYFLY</span>
            <span>All Rights Reserved</span>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};
