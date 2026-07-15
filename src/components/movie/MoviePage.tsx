import * as React from 'react';
import { Clapperboard, Film, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { HeroBanner } from '../hero/HeroBanner';
import { MovieRow } from './MovieRow';
import { MovieRowSkeleton } from './MovieRowSkeleton';
import { MovieData } from './MovieCard';
import { movieService } from '../../services/movie.service';
import { heroService } from '../../services/hero.service';
import { navigate } from '../../lib/router';
import { fetchFromTMDB } from '../../lib/api/tmdb';
import { mapTMDBMovieToMovieData } from '../../lib/api/mappers';
import { TMDBMovieResponse } from '../../types/movie';

interface MoviePageProps {
  collapsed?: boolean;
  watchlist: Record<string, boolean>;
  onToggleWatchlist: (movie: MovieData) => void;
}

// Curated high-fidelity list of modern, premium, and upcoming Hollywood & Indian blockbusters
const HERO_QUERIES = [
  // Indian titles
  { query: 'Pushpa 2: The Rule', isIndian: true },
  { query: 'Stree 2', isIndian: true },
  { query: 'Kalki 2898 AD', isIndian: true },
  { query: 'War 2', isIndian: true },
  { query: 'Coolie', isIndian: true },
  { query: 'King', isIndian: true },
  { query: 'Jaat', isIndian: true },
  { query: 'Sikandar', isIndian: true },
  { query: 'Chhaava', isIndian: true },
  { query: 'Animal', isIndian: true },
  { query: 'Jawan', isIndian: true },
  { query: 'Pathaan', isIndian: true },

  // International titles
  { query: 'Mission: Impossible - The Final Reckoning', isIndian: false },
  { query: 'Superman', isIndian: false },
  { query: 'The Fantastic Four: First Steps', isIndian: false },
  { query: 'F1', isIndian: false },
  { query: 'Thunderbolts*', isIndian: false },
  { query: 'Avatar: The Way of Water', isIndian: false },
  { query: 'Dune: Part Two', isIndian: false },
  { query: 'John Wick: Chapter 4', isIndian: false },
  { query: 'Oppenheimer', isIndian: false }
];

export const MoviePage: React.FC<MoviePageProps> = ({
  collapsed = false,
  watchlist,
  onToggleWatchlist,
}) => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Movie content states
  const [heroMovies, setHeroMovies] = React.useState<MovieData[]>([]);
  const [trendingMovies, setTrendingMovies] = React.useState<MovieData[]>([]);
  const [popularMovies, setPopularMovies] = React.useState<MovieData[]>([]);
  const [topRatedMovies, setTopRatedMovies] = React.useState<MovieData[]>([]);
  const [nowPlayingMovies, setNowPlayingMovies] = React.useState<MovieData[]>([]);
  const [upcomingMovies, setUpcomingMovies] = React.useState<MovieData[]>([]);
  const [bollywoodBlockbusters, setBollywoodBlockbusters] = React.useState<MovieData[]>([]);
  const [trendingInIndia, setTrendingInIndia] = React.useState<MovieData[]>([]);
  const [trendingWorldwide, setTrendingWorldwide] = React.useState<MovieData[]>([]);
  const [hollywoodHits, setHollywoodHits] = React.useState<MovieData[]>([]);

  // Genre and specialized states
  const [actionMovies, setActionMovies] = React.useState<MovieData[]>([]);
  const [comedyMovies, setComedyMovies] = React.useState<MovieData[]>([]);
  const [romanceMovies, setRomanceMovies] = React.useState<MovieData[]>([]);
  const [horrorMovies, setHorrorMovies] = React.useState<MovieData[]>([]);
  const [thrillerMovies, setThrillerMovies] = React.useState<MovieData[]>([]);
  const [scifiMovies, setScifiMovies] = React.useState<MovieData[]>([]);
  const [familyMovies, setFamilyMovies] = React.useState<MovieData[]>([]);
  const [crimeMovies, setCrimeMovies] = React.useState<MovieData[]>([]);
  const [superheroMovies, setSuperheroMovies] = React.useState<MovieData[]>([]);
  const [dramaMovies, setDramaMovies] = React.useState<MovieData[]>([]);
  const [oscarWinners, setOscarWinners] = React.useState<MovieData[]>([]);
  const [editorsPicks, setEditorsPicks] = React.useState<MovieData[]>([]);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Warm genre cache
      await movieService.fetchAndSetGenres();

      const fetchWithFallback = async <T,>(promise: Promise<T[]>, fallback: T[] = []): Promise<T[]> => {
        try {
          return await promise;
        } catch (e) {
          console.warn('Failed fetching movie page subset:', e);
          return fallback;
        }
      };

      // 2. STAGE 1: Fetch Hero search queries and primary lists in parallel
      const [
        finalHero,
        trendingRes,
        popularRes,
        topRatedRes,
        nowPlayingRes,
        upcomingRes,
        bollywoodRes,
        southIndianRes,
      ] = await Promise.all([
        heroService.getHeroMoviePool(true),
        fetchWithFallback(movieService.getWeeklyTrendingMovies()),
        fetchWithFallback(movieService.getPopularMovies()),
        fetchWithFallback(movieService.getTopRatedMovies()),
        fetchWithFallback(movieService.getNowPlayingMovies()),
        fetchWithFallback(movieService.getUpcomingMovies()),
        fetchWithFallback(movieService.getBollywoodMovies()),
        fetchWithFallback(movieService.getSouthIndianMovies()),
      ]);

      setHeroMovies(finalHero);

      // Save IDs to prevent duplicates in near-top rows
      const seenIds = new Set<string>();
      finalHero.forEach(m => seenIds.add(m.id));

      // Row 1: 🔥 Trending Movies
      const trendList = trendingRes.filter(m => !seenIds.has(m.id)).slice(0, 18);
      trendList.forEach(m => seenIds.add(m.id));
      setTrendingMovies(trendList);

      // Row 2: ⭐ Popular Movies
      const popList = popularRes.filter(m => !seenIds.has(m.id)).slice(0, 18);
      popList.forEach(m => seenIds.add(m.id));
      setPopularMovies(popList);

      // Row 3: 🏆 Top Rated Movies
      const topList = topRatedRes.filter(m => !seenIds.has(m.id)).slice(0, 18);
      topList.forEach(m => seenIds.add(m.id));
      setTopRatedMovies(topList);

      // Row 4: 🎬 Now Playing
      const playList = nowPlayingRes.filter(m => !seenIds.has(m.id)).slice(0, 18);
      playList.forEach(m => seenIds.add(m.id));
      setNowPlayingMovies(playList);

      // Row 5: 🎟️ Upcoming Movies
      const upList = upcomingRes.filter(m => !seenIds.has(m.id)).slice(0, 18);
      upList.forEach(m => seenIds.add(m.id));
      setUpcomingMovies(upList);

      // Row 6: 🎥 Bollywood Blockbusters
      const bollyList = bollywoodRes.filter(m => !seenIds.has(m.id)).slice(0, 18);
      bollyList.forEach(m => seenIds.add(m.id));
      setBollywoodBlockbusters(bollyList);

      // --- INSTANT STAGE 1 FINISHED STATE ---
      setLoading(false);

      // 3. STAGE 2: Fetch and construct specialized Indian & international rows
      const [
        indianRes,
        hollywoodRes,
        actionRes,
        comedyRes,
        romanceRes,
        horrorRes,
      ] = await Promise.all([
        fetchWithFallback(movieService.getIndianMovies()),
        fetchWithFallback(movieService.getHollywoodMovies()),
        fetchWithFallback(movieService.getMoviesByGenre(28)), // Action
        fetchWithFallback(movieService.getMoviesByGenre(35)), // Comedy
        fetchWithFallback(movieService.getMoviesByGenre(10749)), // Romance
        fetchWithFallback(movieService.getMoviesByGenre(27)), // Horror
      ]);

      // Row 7: 🇮🇳 Trending in India
      const tIndia = indianRes.filter(m => !seenIds.has(m.id)).slice(0, 18);
      tIndia.forEach(m => seenIds.add(m.id));
      setTrendingInIndia(tIndia);

      // Row 8: 🌍 Trending Worldwide
      // Strict Movies Worldwide (mixing Hollywood with top internationals)
      const tWorld = [...hollywoodRes, ...trendingRes]
        .filter(m => m && !seenIds.has(m.id) && m.language !== 'HI')
        .slice(0, 18);
      tWorld.forEach(m => seenIds.add(m.id));
      setTrendingWorldwide(tWorld);

      // Row 9: 🍿 Hollywood Hits
      const hWood = hollywoodRes.filter(m => !seenIds.has(m.id)).slice(0, 18);
      hWood.forEach(m => seenIds.add(m.id));
      setHollywoodHits(hWood);

      // Row 10: 💥 Action Movies
      const act = actionRes.filter(m => !seenIds.has(m.id)).slice(0, 18);
      act.forEach(m => seenIds.add(m.id));
      setActionMovies(act);

      // Row 11: 😂 Comedy Movies
      const com = comedyRes.filter(m => !seenIds.has(m.id)).slice(0, 18);
      com.forEach(m => seenIds.add(m.id));
      setComedyMovies(com);

      // Row 12: ❤️ Romance Movies
      const rom = romanceRes.filter(m => !seenIds.has(m.id)).slice(0, 18);
      rom.forEach(m => seenIds.add(m.id));
      setRomanceMovies(rom);

      // 4. STAGE 3: Fetch and build the remaining specialized genre & theme rows
      const [
        thrillerRes,
        scifiRes,
        familyRes,
        crimeRes,
        dramaRes,
        superheroRawRes,
      ] = await Promise.all([
        fetchWithFallback(movieService.getMoviesByGenre(53)), // Thriller
        fetchWithFallback(movieService.getMoviesByGenre(878)), // Sci-Fi
        fetchWithFallback(movieService.getMoviesByGenre(10751)), // Family
        fetchWithFallback(movieService.getMoviesByGenre(80)), // Crime
        fetchWithFallback(movieService.getMoviesByGenre(18)), // Drama
        fetchWithFallback(
          fetchFromTMDB<TMDBMovieResponse>('/discover/movie', {
            with_genres: '28|12|878',
            sort_by: 'popularity.desc',
            page: 1,
          }).then(r => r.results.map(mapTMDBMovieToMovieData))
        ),
      ]);

      // Row 13: 😱 Horror Movies
      const hor = horrorRes.filter(m => !seenIds.has(m.id)).slice(0, 18);
      hor.forEach(m => seenIds.add(m.id));
      setHorrorMovies(hor);

      // Row 14: 🧠 Thriller Movies
      const thr = thrillerRes.filter(m => !seenIds.has(m.id)).slice(0, 18);
      thr.forEach(m => seenIds.add(m.id));
      setThrillerMovies(thr);

      // Row 15: 🚀 Sci-Fi Movies
      const sci = scifiRes.filter(m => !seenIds.has(m.id)).slice(0, 18);
      sci.forEach(m => seenIds.add(m.id));
      setScifiMovies(sci);

      // Row 16: 👨‍👩‍👧 Family Movies
      const fam = familyRes.filter(m => !seenIds.has(m.id)).slice(0, 18);
      fam.forEach(m => seenIds.add(m.id));
      setFamilyMovies(fam);

      // Row 17: 🕵 Crime Movies
      const cri = crimeRes.filter(m => !seenIds.has(m.id)).slice(0, 18);
      cri.forEach(m => seenIds.add(m.id));
      setCrimeMovies(cri);

      // Row 18: 🦸 Superhero Movies
      const superheros = superheroRawRes.filter(m => !seenIds.has(m.id)).slice(0, 18);
      superheros.forEach(m => seenIds.add(m.id));
      setSuperheroMovies(superheros);

      // Row 19: 🎭 Drama Movies
      const dra = dramaRes.filter(m => !seenIds.has(m.id)).slice(0, 18);
      dra.forEach(m => seenIds.add(m.id));
      setDramaMovies(dra);

      // Row 20: 🎖 Oscar Winners (Highly-rated, popular masterpieces)
      const oscars = topList
        .concat(popList)
        .filter(m => parseFloat(String(m.rating)) >= 7.8)
        .slice(0, 18);
      setOscarWinners(oscars);

      // Row 21: ✨ Editor's Picks (Curated beautiful layout recommendations)
      const picks = finalHero
        .concat(trendList)
        .filter(m => m && m.rating)
        .slice(2, 20);
      setEditorsPicks(picks);

    } catch (err: any) {
      console.error('Error fetching TMDB movie data:', err);
      setError(err.message || 'An error occurred while loading content from TMDB.');
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePlayMovie = (movie: MovieData) => {
    navigate(`/movie/${movie.id}`);
  };

  const handleMoreInfo = (movie: MovieData) => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="w-full flex-grow flex flex-col">
      {error ? (
        <div className="flex-grow flex items-center justify-center py-28 px-4 transition-all duration-300">
          <div className="text-center max-w-md p-8 rounded-2xl bg-white/[0.01] border border-white/5 shadow-purple-glow relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 shadow-purple-glow">
              <Film className="h-7 w-7 text-primary animate-pulse" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight mb-2">Movies Catalog Offline</h3>
            <p className="text-xs text-[#B3B3B8] leading-relaxed mb-6">
              We had trouble connecting to the movie database services. Please verify your TMDB API credentials.
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
              <span className="text-xs text-[#B3B3B8]/50 font-bold uppercase tracking-widest">Waking Movie Cinema...</span>
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
          {/* Immersive Rotating Hero Banner - strictly Movies with custom 9s auto-rotation interval */}
          <HeroBanner movies={heroMovies} collapsed={collapsed} />

          {/* Cinematic horizontally scrollable Movie rows */}
          <div className="relative z-30 px-4 sm:px-8 pb-16 w-full flex flex-col gap-14 pt-12 md:pt-16 md:pr-8 transition-all duration-300">
            {/* Row 1: 🔥 Trending Movies */}
            {trendingMovies.length > 0 && (
              <MovieRow
                title="🔥 Trending Movies"
                movies={trendingMovies}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/popular-movies')}
              />
            )}

            {/* Row 2: ⭐ Popular Movies */}
            {popularMovies.length > 0 && (
              <MovieRow
                title="⭐ Popular Movies"
                movies={popularMovies}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/popular-movies')}
              />
            )}

            {/* Row 3: 🏆 Top Rated Movies */}
            {topRatedMovies.length > 0 && (
              <MovieRow
                title="🏆 Top Rated Movies"
                movies={topRatedMovies}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/top-rated')}
              />
            )}

            {/* Row 4: 🎬 Now Playing */}
            {nowPlayingMovies.length > 0 && (
              <MovieRow
                title="🎬 Now Playing"
                movies={nowPlayingMovies}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/new-releases')}
              />
            )}

            {/* Row 5: 🎟️ Upcoming Movies */}
            {upcomingMovies.length > 0 && (
              <MovieRow
                title="🎟️ Upcoming Movies"
                movies={upcomingMovies}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/new-releases')}
              />
            )}

            {/* Row 6: 🎥 Bollywood Blockbusters */}
            {bollywoodBlockbusters.length > 0 && (
              <MovieRow
                title="🎥 Bollywood Blockbusters"
                movies={bollywoodBlockbusters}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/bollywood-blockbusters')}
              />
            )}

            {/* Row 7: 🇮🇳 Trending in India */}
            {trendingInIndia.length > 0 && (
              <MovieRow
                title="🇮🇳 Trending in India"
                movies={trendingInIndia}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/trending-in-india')}
              />
            )}

            {/* Row 8: 🌍 Trending Worldwide */}
            {trendingWorldwide.length > 0 && (
              <MovieRow
                title="🌍 Trending Worldwide"
                movies={trendingWorldwide}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/trending-worldwide')}
              />
            )}

            {/* Row 9: 🍿 Hollywood Hits */}
            {hollywoodHits.length > 0 && (
              <MovieRow
                title="🍿 Hollywood Hits"
                movies={hollywoodHits}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/hindi-dubbed-movies')}
              />
            )}

            {/* Row 10: 💥 Action Movies */}
            {actionMovies.length > 0 && (
              <MovieRow
                title="💥 Action Movies"
                movies={actionMovies}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/scifi')}
              />
            )}

            {/* Row 11: 😂 Comedy Movies */}
            {comedyMovies.length > 0 && (
              <MovieRow
                title="😂 Comedy Movies"
                movies={comedyMovies}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/comedy')}
              />
            )}

            {/* Row 12: ❤️ Romance Movies */}
            {romanceMovies.length > 0 && (
              <MovieRow
                title="❤️ Romance Movies"
                movies={romanceMovies}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/romance')}
              />
            )}

            {/* Row 13: 😱 Horror Movies */}
            {horrorMovies.length > 0 && (
              <MovieRow
                title="😱 Horror Movies"
                movies={horrorMovies}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/horror')}
              />
            )}

            {/* Row 14: 🧠 Thriller Movies */}
            {thrillerMovies.length > 0 && (
              <MovieRow
                title="🧠 Thriller Movies"
                movies={thrillerMovies}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/crime-thrillers')}
              />
            )}

            {/* Row 15: 🚀 Sci-Fi Movies */}
            {scifiMovies.length > 0 && (
              <MovieRow
                title="🚀 Sci-Fi Movies"
                movies={scifiMovies}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/scifi')}
              />
            )}

            {/* Row 16: 👨‍👩‍👧 Family Movies */}
            {familyMovies.length > 0 && (
              <MovieRow
                title="👨‍👩‍👧 Family Movies"
                movies={familyMovies}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/comedy')}
              />
            )}

            {/* Row 17: 🕵 Crime Movies */}
            {crimeMovies.length > 0 && (
              <MovieRow
                title="🕵 Crime Movies"
                movies={crimeMovies}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/crime-thrillers')}
              />
            )}

            {/* Row 18: 🦸 Superhero Movies */}
            {superheroMovies.length > 0 && (
              <MovieRow
                title="🦸 Superhero Movies"
                movies={superheroMovies}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/scifi')}
              />
            )}

            {/* Row 19: 🎭 Drama Movies */}
            {dramaMovies.length > 0 && (
              <MovieRow
                title="🎭 Drama Movies"
                movies={dramaMovies}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/top-rated')}
              />
            )}

            {/* Row 20: 🎖 Oscar Winners */}
            {oscarWinners.length > 0 && (
              <MovieRow
                title="🎖 Oscar Winners"
                movies={oscarWinners}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/top-rated')}
              />
            )}

            {/* Row 21: ✨ Editor's Picks */}
            {editorsPicks.length > 0 && (
              <MovieRow
                title="✨ Editor's Picks"
                movies={editorsPicks}
                onPlayMovie={handlePlayMovie}
                onMoreInfo={handleMoreInfo}
                onToggleWatchlist={onToggleWatchlist}
                watchlist={watchlist}
                onSeeAll={() => navigate('/movies/popular-movies')}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
