import * as React from 'react';
import { ChevronLeft, RefreshCw, AlertTriangle, Tv } from 'lucide-react';
import { TMDBTVDetails } from '../../types/tv';
import { MovieData } from '../movie/MovieCard';
import { tvService } from '../../services/tv.service';
import { TVPlayer } from './TVPlayer';
import { SeasonSelector } from './SeasonSelector';
import { EpisodeSelector } from './EpisodeSelector';
import { CurrentEpisode } from './CurrentEpisode';
import { NextEpisodeCard } from './NextEpisodeCard';
import { ContinueWatchingManager } from './ContinueWatchingManager';
import { RecommendationRow } from '../tv/RecommendationRow';
import { SimilarSeriesRow } from '../tv/SimilarSeriesRow';
import { navigate } from '../../lib/router';
import { LocalStorageManager } from './LocalStorageManager';
import { PlayerController } from './PlayerController';
import { updateClientSEO } from '../../lib/seo';
import { generateTVSeriesSchema, generateVideoObjectSchema, injectSchema, clearSchema } from '../../lib/schema';
import { getBackdropUrl, getPosterUrl } from '../../config/tmdb';

interface WatchTVPageProps {
  tvId: string;
  watchlist: Record<string, boolean>;
  onToggleWatchlist: (movie: MovieData) => void;
}

export const WatchTVPage: React.FC<WatchTVPageProps> = ({
  tvId,
  watchlist,
  onToggleWatchlist,
}) => {
  const [tvShow, setTvShow] = React.useState<TMDBTVDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  // Streaming state: Season and Episode
  const [season, setSeason] = React.useState<number>(1);
  const [episode, setEpisode] = React.useState<number>(1);
  const [loadRecommendations, setLoadRecommendations] = React.useState(false);
  const [activeServerId, setActiveServerId] = React.useState(() =>
    LocalStorageManager.getPreferredServer('server-a')
  );

  // Raw numeric ID
  const rawTmdbId = tvId.replace('tv-', '');

  // 1. Fetch TV Details on mount or tvId change
  const fetchTVShowDetails = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const details = await tvService.getFullTVDetails(rawTmdbId);
      setTvShow(details);

      // Determine initial Season and Episode
      const urlParams = new URLSearchParams(window.location.search);
      const querySeason = urlParams.get('season');
      const queryEpisode = urlParams.get('episode');

      if (querySeason && queryEpisode) {
        // Use query params if explicitly defined
        const s = Number(querySeason);
        const e = Number(queryEpisode);
        setSeason(s);
        setEpisode(e);
        ContinueWatchingManager.saveProgress(rawTmdbId, s, e);
      } else {
        // Fall back to local progress
        const progress = ContinueWatchingManager.getProgress(rawTmdbId);
        if (progress) {
          setSeason(progress.season);
          setEpisode(progress.episode);
          // Sync URL query without reloading the page
          window.history.replaceState(
            null,
            '',
            `?season=${progress.season}&episode=${progress.episode}`
          );
        } else {
          // Default to S1E1
          setSeason(1);
          setEpisode(1);
          ContinueWatchingManager.saveProgress(rawTmdbId, 1, 1);
          window.history.replaceState(null, '', `?season=1&episode=1`);
        }
      }
    } catch (err: any) {
      console.error('Error fetching TMDB TV Details for Watch page:', err);
      setError(err.message || 'The TV show details could not be retrieved.');
    } finally {
      setLoading(false);
    }
  }, [rawTmdbId]);

  React.useEffect(() => {
    fetchTVShowDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoadRecommendations(false);

    // Prioritize initial stream loading, then load rows after a small delay
    const timer = setTimeout(() => {
      setLoadRecommendations(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [tvId, fetchTVShowDetails]);

  React.useEffect(() => {
    return () => {
      // Restore default homepage SEO on unmount
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://moviyfly1.onrender.com';
      updateClientSEO({
        title: 'MoviyFly - Watch Movies & TV Shows Online',
        description: 'Watch trending movies and TV shows on MoviyFly. Discover new releases, top-rated films, popular series, and build your personal watchlist.',
        url: `${origin}/`,
        type: 'website'
      });
    };
  }, []);

  React.useEffect(() => {
    if (loading || !tvShow) {
      updateClientSEO({
        title: 'Watch TV Show Online | MoviyFly',
        description: 'Prepare your stream. High definition series theater is loading on MoviyFly.',
        type: 'video.tv_show',
        url: typeof window !== 'undefined' ? window.location.href : '',
      });
    } else {
      const image = tvShow.backdrop_path ? getBackdropUrl(tvShow.backdrop_path) : (tvShow.poster_path ? getPosterUrl(tvShow.poster_path) : undefined);
      updateClientSEO({
        title: `Watch ${tvShow.name} Season ${season} Episode ${episode} Online | MoviyFly`,
        description: tvShow.overview || `Stream ${tvShow.name} Season ${season} Episode ${episode} in HD quality with fast streaming servers on MoviyFly.`,
        image: image,
        type: 'video.tv_show',
        url: typeof window !== 'undefined' ? window.location.href : '',
      });
    }
  }, [tvShow, season, episode, loading]);

  // Schema.org structured data injection for TV watch page
  React.useEffect(() => {
    if (!loading && tvShow) {
      const imageUrl = tvShow.backdrop_path ? getBackdropUrl(tvShow.backdrop_path) : (tvShow.poster_path ? getPosterUrl(tvShow.poster_path) : '');

      const tvSchema = generateTVSeriesSchema({
        name: tvShow.name,
        description: tvShow.overview || `Binge watch ${tvShow.name} seasons and episodes in high definition on MoviyFly.`,
        poster: imageUrl,
        firstAirDate: tvShow.first_air_date || '',
        genres: tvShow.genres ? tvShow.genres.map(g => g.name) : [],
        numberOfSeasons: tvShow.number_of_seasons || 1,
        rating: {
          ratingValue: tvShow.vote_average || 0,
          ratingCount: tvShow.vote_count || 100,
        },
        tmdbId: rawTmdbId,
        canonicalUrl: `https://moviyfly.vercel.app/tv/${rawTmdbId}`,
        inLanguage: tvShow.original_language,
      });

      const videoSchema = generateVideoObjectSchema({
        name: `Watch ${tvShow.name} Season ${season} Episode ${episode} Online`,
        description: tvShow.overview || `Watch ${tvShow.name} Season ${season} Episode ${episode} online on MoviyFly.`,
        thumbnailUrl: imageUrl,
        embedUrl: typeof window !== 'undefined' ? window.location.href : `https://moviyfly.vercel.app/watch/tv/${rawTmdbId}?season=${season}&episode=${episode}`,
        uploadDate: tvShow.first_air_date || '',
        inLanguage: tvShow.original_language,
      });

      injectSchema(tvSchema, 'moviyfly-watch-tv-schema');
      injectSchema(videoSchema, 'moviyfly-watch-video-schema');
    }

    return () => {
      clearSchema('moviyfly-watch-tv-schema');
      clearSchema('moviyfly-watch-video-schema');
    };
  }, [tvShow, rawTmdbId, season, episode, loading]);

  // 2. Synchronize url queries when back/forward navigation occurs
  React.useEffect(() => {
    const handleUrlSync = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const s = urlParams.get('season');
      const e = urlParams.get('episode');
      if (s) setSeason(Number(s));
      if (e) setEpisode(Number(e));
    };

    window.addEventListener('popstate', handleUrlSync);
    return () => window.removeEventListener('popstate', handleUrlSync);
  }, []);

  // 3. Update Stream selection helper
  const handleSelectEpisode = (newSeason: number, newEpisode: number) => {
    setSeason(newSeason);
    setEpisode(newEpisode);
    ContinueWatchingManager.saveProgress(rawTmdbId, newSeason, newEpisode);
    
    // Update active URL parameter cleanly
    window.history.pushState(
      null,
      '',
      `?season=${newSeason}&episode=${newEpisode}`
    );

    // Smooth scroll back to theater
    const playerEl = document.getElementById('watch-tv-player-wrapper');
    if (playerEl) {
      playerEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleToggleWatchlist = () => {
    if (!tvShow) return;

    const startYear = tvShow.first_air_date ? tvShow.first_air_date.split('-')[0] : 'N/A';
    const seasonsLabel = tvShow.number_of_seasons > 1
      ? `${tvShow.number_of_seasons} Seasons`
      : `${tvShow.number_of_seasons || 1} Season`;

    const mapped: MovieData = {
      id: `tv-${tvShow.id}`,
      title: tvShow.name,
      overview: tvShow.overview,
      genres: tvShow.genres ? tvShow.genres.map((g) => g.name) : [],
      rating: (typeof tvShow.vote_average === 'number' && Number.isFinite(tvShow.vote_average)) ? tvShow.vote_average.toFixed(1) : '0.0',
      year: startYear,
      runtime: seasonsLabel,
      language: tvShow.original_language?.toUpperCase() || 'EN',
      ageRating: 'TV-14',
      poster: tvShow.poster_path ? getPosterUrl(tvShow.poster_path) : '',
      backdrop: tvShow.backdrop_path ? getBackdropUrl(tvShow.backdrop_path) : '',
    };
    onToggleWatchlist(mapped);
  };

  const handleBackToDetails = () => {
    navigate(`/tv/tv-${rawTmdbId}`);
  };

  const handleBackToCatalog = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-8 py-6 select-none animate-pulse" id="watch-tv-loading-skeleton">
        {/* Breadcrumb line */}
        <div className="h-5 bg-white/[0.04] rounded-full w-32" />

        {/* Big Video Theater Frame */}
        <div className="w-full aspect-video rounded-[32px] bg-white/[0.02] border border-white/[0.04] flex items-center justify-center">
          <div className="text-center flex flex-col gap-3">
            <Tv className="h-10 w-10 text-primary/40 animate-bounce mx-auto" />
            <span className="text-xs text-text-muted font-bold uppercase tracking-widest">
              Connecting HD Media Host...
            </span>
          </div>
        </div>

        {/* Content Box */}
        <div className="p-8 rounded-3xl bg-[#13131A]/40 border border-white/[0.04] space-y-4">
          <div className="h-6 bg-white/[0.05] rounded-full w-1/3" />
          <div className="h-4 bg-white/[0.03] rounded-full w-1/4" />
          <div className="h-16 bg-white/[0.02] rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  if (error || !tvShow) {
    const is404 = error?.includes('404') || !tvShow;

    return (
      <div className="w-full flex-grow flex items-center justify-center py-20 px-4 select-none" id="watch-tv-error-boundary">
        <div className="text-center max-w-md p-10 rounded-[32px] bg-[#13131A] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="mx-auto h-16 w-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
            <AlertTriangle className="h-7 w-7 text-red-500 animate-pulse" />
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-3">
            {is404 ? 'TV Stream Offline' : 'Connection Failure'}
          </h2>

          <p className="text-xs text-text-secondary leading-relaxed mb-8">
            {is404
              ? 'The TV show details could not be found in the system catalog. It may have been retired or you used an incorrect TMDB identifier.'
              : 'We encountered a connection issue syncing show metadata with the TMDB server. Please try again.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleBackToCatalog}
              className="flex-grow py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              id="btn-tv-error-back"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Catalog</span>
            </button>

            {!is404 && (
              <button
                onClick={fetchTVShowDetails}
                className="flex-grow py-3 px-5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                id="btn-tv-error-retry"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry Connection</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const tvShowIdStr = `tv-${tvShow.id}`;
  const tvShowRawId = String(tvShow.id);
  const isShowInWatchlist = !!(
    watchlist[tvShowIdStr] ||
    watchlist[tvShowRawId] ||
    watchlist[`movie-${tvShowRawId}`] ||
    watchlist[`tv-${tvShowRawId}`]
  );

  return (
    <div className="w-full max-w-8xl mx-auto py-4 space-y-8 select-none" id="watch-tv-page-content-grid">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={handleBackToDetails}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-primary transition-all cursor-pointer group"
          id="btn-tv-watch-back-link"
        >
          <ChevronLeft className="h-4.5 w-4.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Series Info</span>
        </button>

        <div className="flex items-center gap-2 text-[10px] font-extrabold text-text-muted uppercase tracking-wider">
          <Tv className="h-3.5 w-3.5 text-[#8B5CF6] animate-pulse" />
          <span>OTT TV Series Theater</span>
        </div>
      </div>

      {/* TV Stream Block */}
      <TVPlayer
        tmdbId={rawTmdbId}
        season={season}
        episode={episode}
        title={tvShow.name}
        activeServerId={activeServerId}
        onBackToTVShow={handleBackToDetails}
      />

      {/* Multi-Server Controller */}
      <PlayerController
        activeServerId={activeServerId}
        onServerChange={(serverId) => {
          setActiveServerId(serverId);
          LocalStorageManager.setPreferredServer(serverId);
        }}
        tmdbId={rawTmdbId}
        type="tv"
        season={season}
        episode={episode}
      />

      {/* Suggest Next Episode Card if possible */}
      <NextEpisodeCard
        tvId={rawTmdbId}
        currentSeason={season}
        currentEpisode={episode}
        totalSeasons={tvShow.number_of_seasons}
        onNavigateToNext={(s, e) => handleSelectEpisode(s, e)}
      />

      {/* Episode Navigation and Selection Guide */}
      <div className="space-y-6">
        <SeasonSelector
          totalSeasons={tvShow.number_of_seasons}
          currentSeason={season}
          onSeasonChange={(s) => handleSelectEpisode(s, 1)}
        />

        <EpisodeSelector
          tvId={rawTmdbId}
          seasonNumber={season}
          currentEpisodeNumber={episode}
          onEpisodeSelect={(e) => handleSelectEpisode(season, e)}
        />
      </div>

      {/* Meta details & Action Row below player */}
      <CurrentEpisode
        tvShow={tvShow}
        seasonNumber={season}
        episodeNumber={episode}
        isInWatchlist={isShowInWatchlist}
        onToggleWatchlist={handleToggleWatchlist}
        onBack={handleBackToDetails}
      />

      {/* Dynamic recommendations and similar rows loaded later to prioritize streaming performance */}
      {loadRecommendations && (
        <div className="space-y-12 pt-4 px-1 animate-fade-in">
          <div className="h-px bg-white/[0.04]" />

          <RecommendationRow
            tvId={rawTmdbId}
            watchlist={watchlist}
            onPlayMovie={(m) => {
              navigate(`/watch/tv/${m.id.replace('tv-', '')}?season=1&episode=1`);
            }}
            onMoreInfo={(m) => navigate(`/tv/${m.id}`)}
            onToggleWatchlist={onToggleWatchlist}
          />

          <div className="h-px bg-white/[0.04]" />

          <SimilarSeriesRow
            tvId={rawTmdbId}
            watchlist={watchlist}
            onPlayMovie={(m) => {
              navigate(`/watch/tv/${m.id.replace('tv-', '')}?season=1&episode=1`);
            }}
            onMoreInfo={(m) => navigate(`/tv/${m.id}`)}
            onToggleWatchlist={onToggleWatchlist}
          />
        </div>
      )}
    </div>
  );
};
