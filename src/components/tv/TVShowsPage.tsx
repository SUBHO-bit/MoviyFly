import * as React from 'react';
import { Clapperboard, Tv, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { HeroBanner } from '../hero/HeroBanner';
import { MovieRow } from '../movie/MovieRow';
import { MovieRowSkeleton } from '../movie/MovieRowSkeleton';
import { MovieData } from '../movie/MovieCard';
import { tvService } from '../../services/tv.service';
import { navigate, getDetailsPath } from '../../lib/router';
import { fillCategoryRow } from '../../lib/utils/backfill';

interface TVShowsPageProps {
  collapsed?: boolean;
  watchlist: Record<string, boolean>;
  onToggleWatchlist: (show: MovieData) => void;
}

/**
 * Intelligent helper to estimate seasons for standard TV shows
 */
const getSeasonsByTitle = (title: string, popularity: number = 0): string => {
  const lower = title.toLowerCase();
  
  // Specific famous series
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
  if (lower.includes('special ops')) return '2. Seasons';
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
  
  // Fallback estimates based on TMDB popularity metrics
  if (popularity > 300) return '4 Seasons';
  if (popularity > 150) return '3 Seasons';
  if (popularity > 80) return '2 Seasons';
  return '1 Season';
};

/**
 * Strictly filters out Movies, Anime, and K-Dramas as requested by the user
 */
const filterTVShowsOnly = (shows: MovieData[]): MovieData[] => {
  return shows.filter(show => {
    if (!show || !show.id) return false;
    
    // Must be TV
    if (!show.id.startsWith('tv-')) return false;
    
    // Exclude Anime (Animation genre or Japanese language)
    const hasAnimationGenre = show.genres.some(g => g.toLowerCase().includes('animation') || g.toLowerCase().includes('anime'));
    const isJapanese = show.language === 'JA' || show.language === 'JA-JP';
    if (hasAnimationGenre || isJapanese) return false;

    // Exclude K-Drama (Korean language or East-Asian soap language)
    const isEastAsian = show.language === 'KO' || show.language === 'KO-KR' || show.language === 'ZH' || show.language === 'ZH-CN';
    if (isEastAsian) return false;

    return true;
  });
};

/**
 * Maps the items with formatted seasons string in the runtime field
 */
const mapWithSeasons = (list: MovieData[]): MovieData[] => {
  return filterTVShowsOnly(list).map(item => ({
    ...item,
    runtime: getSeasonsByTitle(item.title, item.popularity || 0)
  }));
};

export const TVShowsPage: React.FC<TVShowsPageProps> = ({
  collapsed = false,
  watchlist,
  onToggleWatchlist,
}) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Core TV pools
  const [heroShows, setHeroShows] = React.useState<MovieData[]>([]);
  const [trendingTV, setTrendingTV] = React.useState<MovieData[]>([]);
  const [airingToday, setAiringToday] = React.useState<MovieData[]>([]);
  const [topRatedTV, setTopRatedTV] = React.useState<MovieData[]>([]);
  const [indianTV, setIndianTV] = React.useState<MovieData[]>([]);
  const [internationalTV, setInternationalTV] = React.useState<MovieData[]>([]);

  // Platform & Genre TV pools
  const [netflixOriginals, setNetflixOriginals] = React.useState<MovieData[]>([]);
  const [appleTVOriginals, setAppleTVOriginals] = React.useState<MovieData[]>([]);
  const [hboOriginals, setHBOOriginals] = React.useState<MovieData[]>([]);
  const [disneyOriginals, setDisneyOriginals] = React.useState<MovieData[]>([]);
  const [primeOriginals, setPrimeOriginals] = React.useState<MovieData[]>([]);
  const [sciFiSeries, setSciFiSeries] = React.useState<MovieData[]>([]);
  const [horrorSeries, setHorrorSeries] = React.useState<MovieData[]>([]);
  const [comedySeries, setComedySeries] = React.useState<MovieData[]>([]);
  const [crimeMystery, setCrimeMystery] = React.useState<MovieData[]>([]);
  const [romanceSeries, setRomanceSeries] = React.useState<MovieData[]>([]);
  const [actionSeries, setActionSeries] = React.useState<MovieData[]>([]);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Warm up TV genre definitions synchronously
      await tvService.fetchAndSetTVGenres();

      const fetchTvRow = (fetcher: (p: number) => Promise<MovieData[]>) => async (p: number) => {
        const raw = await fetcher(p);
        return mapWithSeasons(raw);
      };

      const seenIds = new Set<string>();

      // STAGE 1: Fetch Hero and primary top TV rows
      const heroPool = await tvService.getHeroTVPool();
      const finalHero = mapWithSeasons(heroPool);
      setHeroShows(finalHero);
      finalHero.forEach(m => seenIds.add(m.id));

      const [
        trendList,
        airList,
        topList,
        indList,
        intList,
      ] = await Promise.all([
        fillCategoryRow(fetchTvRow((p) => tvService.getWeeklyTrendingTV(p)), seenIds, 18),
        fillCategoryRow(fetchTvRow((p) => tvService.getAiringToday(p)), seenIds, 18),
        fillCategoryRow(fetchTvRow((p) => tvService.getTopRatedTV(p)), seenIds, 18),
        fillCategoryRow(fetchTvRow((p) => tvService.getIndianTVSeries(p)), seenIds, 18),
        fillCategoryRow(fetchTvRow((p) => tvService.getInternationalTVSeries(p)), seenIds, 18),
      ]);

      setTrendingTV(trendList);
      setAiringToday(airList);
      setTopRatedTV(topList);
      setIndianTV(indList);
      setInternationalTV(intList);

      // Complete primary load state quickly
      setLoading(false);

      // STAGE 2: Platform-specific collections & genre categories
      const [
        netflixRes,
        appleTVRes,
        hboRes,
        disneyRes,
        primeRes,
        sciFiRes,
        horrorRes,
        comedyRes,
        crimeRes,
        romanceRes,
        actionRes,
      ] = await Promise.all([
        fillCategoryRow(fetchTvRow((p) => tvService.getNetflixOriginals(p)), seenIds, 18),
        fillCategoryRow(fetchTvRow((p) => tvService.getAppleTVOriginals(p)), seenIds, 18),
        fillCategoryRow(fetchTvRow((p) => tvService.getHBOOriginals(p)), seenIds, 18),
        fillCategoryRow(fetchTvRow((p) => tvService.getDisneyOriginals(p)), seenIds, 18),
        fillCategoryRow(fetchTvRow((p) => tvService.getPrimeOriginals(p)), seenIds, 18),
        fillCategoryRow(fetchTvRow((p) => tvService.getSciFiSeries(p)), seenIds, 18),
        fillCategoryRow(fetchTvRow((p) => tvService.getHorrorSeries(p)), seenIds, 18),
        fillCategoryRow(fetchTvRow((p) => tvService.getComedySeries(p)), seenIds, 18),
        fillCategoryRow(fetchTvRow((p) => tvService.getCrimeMysterySeries(p)), seenIds, 18),
        fillCategoryRow(fetchTvRow((p) => tvService.getRomanceSeries(p)), seenIds, 18),
        fillCategoryRow(fetchTvRow((p) => tvService.getActionSeries(p)), seenIds, 18),
      ]);

      setNetflixOriginals(netflixRes);
      setAppleTVOriginals(appleTVRes);
      setHBOOriginals(hboRes);
      setDisneyOriginals(disneyRes);
      setPrimeOriginals(primeRes);
      setSciFiSeries(sciFiRes);
      setHorrorSeries(horrorRes);
      setComedySeries(comedyRes);
      setCrimeMystery(crimeRes);
      setRomanceSeries(romanceRes);
      setActionSeries(actionRes);

    } catch (err: any) {
      console.error('Error fetching TMDB TV Shows page data:', err);
      setError(err.message || 'An error occurred while loading content from TMDB.');
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePlayShow = (show: MovieData) => {
    navigate(getDetailsPath(show.id, show.title));
  };

  const handleMoreInfo = (show: MovieData) => {
    navigate(getDetailsPath(show.id, show.title));
  };

  return (
    <div className="w-full flex-grow flex flex-col bg-[#0B0B10]">
      {error ? (
        <div className="flex-grow flex items-center justify-center py-28 px-4 transition-all duration-300">
          <div className="text-center max-w-md p-8 rounded-2xl bg-white/[0.01] border border-white/5 shadow-purple-glow relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-purple-glow">
              <Tv className="h-7 w-7 text-primary animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mb-2">TV Shows Catalog Offline</h3>
            <p className="text-xs text-[#B3B3B8] leading-relaxed mb-6">
              We had trouble connecting to the television series database. Please verify your TMDB API credentials.
              <code className="block mt-2 text-primary font-mono text-[11px] p-2 bg-white/5 rounded">{error}</code>
            </p>
            <button
              onClick={loadData}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry Connection
            </button>
          </div>
        </div>
      ) : loading ? (
        <div className="flex flex-col w-full">
          <div className="relative w-full h-screen bg-white/[0.01] animate-pulse flex items-center justify-center">
            <div className="text-center flex flex-col gap-3 transition-all duration-300">
              <Clapperboard className="h-10 w-10 text-primary/40 animate-bounce mx-auto" />
              <span className="text-xs text-[#B3B3B8]/50 font-bold uppercase tracking-widest">Waking TV Channels...</span>
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
          {/* Immersive Rotating Hero Banner - strictly TV Shows with custom 9s auto-rotation interval */}
          <HeroBanner movies={heroShows} collapsed={collapsed} />

          {/* Cinematic horizontally scrollable TV Show rows */}
          <div className="relative z-30 px-4 sm:px-8 pb-16 w-full flex flex-col gap-14 pt-12 md:pt-16 md:pr-8 transition-all duration-300">
            {/* Row 1: 🔥 Trending TV Shows */}
            {trendingTV.length > 0 && (
              <MovieRow
                title="🔥 Trending TV Shows"
                movies={trendingTV}
                onPlayMovie={handlePlayShow}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/popular-tv-shows')}
              />
            )}

            {/* Row 2: 📺 Airing Today */}
            {airingToday.length > 0 && (
              <MovieRow
                title="📺 Airing Today"
                movies={airingToday}
                onPlayMovie={handlePlayShow}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/airing-today-tv')}
              />
            )}

            {/* Row 3: ⭐ Top Rated Series */}
            {topRatedTV.length > 0 && (
              <MovieRow
                title="⭐ Top Rated Series"
                movies={topRatedTV}
                onPlayMovie={handlePlayShow}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/top-rated-tv')}
              />
            )}

            {/* Row 4: 🇮🇳 Indian Web Series */}
            {indianTV.length > 0 && (
              <MovieRow
                title="🇮🇳 Indian Web Series"
                movies={indianTV}
                onPlayMovie={handlePlayShow}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/indian-tv')}
              />
            )}

            {/* Row 5: 🌍 International Series */}
            {internationalTV.length > 0 && (
              <MovieRow
                title="🌍 International Series"
                movies={internationalTV}
                onPlayMovie={handlePlayShow}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/international-tv')}
              />
            )}

            {/* Row 6: 🎬 Netflix Originals */}
            {netflixOriginals.length > 0 && (
              <MovieRow
                title="🎬 Netflix Originals"
                movies={netflixOriginals}
                onPlayMovie={handlePlayShow}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/netflix-originals')}
              />
            )}

            {/* Row 7: 🍎 Apple TV+ */}
            {appleTVOriginals.length > 0 && (
              <MovieRow
                title="🍎 Apple TV+"
                movies={appleTVOriginals}
                onPlayMovie={handlePlayShow}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/apple-tv-originals')}
              />
            )}

            {/* Row 8: 🔥 HBO Originals */}
            {hboOriginals.length > 0 && (
              <MovieRow
                title="🔥 HBO Originals"
                movies={hboOriginals}
                onPlayMovie={handlePlayShow}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/hbo-originals')}
              />
            )}

            {/* Row 9: 👑 Disney+ Originals */}
            {disneyOriginals.length > 0 && (
              <MovieRow
                title="👑 Disney+ Originals"
                movies={disneyOriginals}
                onPlayMovie={handlePlayShow}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/disney-originals')}
              />
            )}

            {/* Row 10: 🎯 Prime Video Originals */}
            {primeOriginals.length > 0 && (
              <MovieRow
                title="🎯 Prime Video Originals"
                movies={primeOriginals}
                onPlayMovie={handlePlayShow}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/prime-originals')}
              />
            )}

            {/* Row 11: 🚀 Sci-Fi Series */}
            {sciFiSeries.length > 0 && (
              <MovieRow
                title="🚀 Sci-Fi Series"
                movies={sciFiSeries}
                onPlayMovie={handlePlayShow}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/scifi-tv')}
              />
            )}

            {/* Row 12: 👻 Horror Series */}
            {horrorSeries.length > 0 && (
              <MovieRow
                title="👻 Horror Series"
                movies={horrorSeries}
                onPlayMovie={handlePlayShow}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/horror-tv')}
              />
            )}

            {/* Row 13: 😂 Comedy Series */}
            {comedySeries.length > 0 && (
              <MovieRow
                title="😂 Comedy Series"
                movies={comedySeries}
                onPlayMovie={handlePlayShow}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/comedy-tv')}
              />
            )}

            {/* Row 14: 🕵 Crime & Mystery */}
            {crimeMystery.length > 0 && (
              <MovieRow
                title="🕵 Crime & Mystery"
                movies={crimeMystery}
                onPlayMovie={handlePlayShow}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/crime-mystery-tv')}
              />
            )}

            {/* Row 15: ❤️ Romance Series */}
            {romanceSeries.length > 0 && (
              <MovieRow
                title="❤️ Romance Series"
                movies={romanceSeries}
                onPlayMovie={handlePlayShow}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/romance-tv')}
              />
            )}

            {/* Row 16: ⚔ Action Series */}
            {actionSeries.length > 0 && (
              <MovieRow
                title="⚔ Action Series"
                movies={actionSeries}
                onPlayMovie={handlePlayShow}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/action-tv')}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
