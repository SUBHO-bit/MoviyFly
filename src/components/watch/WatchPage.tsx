import * as React from 'react';
import { ChevronLeft, AlertTriangle, RefreshCw, Film, Monitor } from 'lucide-react';
import { TMDBMovieDetails } from '../../types/movie';
import { MovieData } from '../movie/MovieCard';
import { movieService } from '../../services/movie.service';
import { MoviePlayer } from './MoviePlayer';
import { WatchActions } from './WatchActions';
import { RecommendationRow } from '../movie/RecommendationRow';
import { SimilarMoviesRow } from '../movie/SimilarMoviesRow';
import { mapTMDBMovieToMovieData } from '../../lib/api/mappers';
import { navigate } from '../../lib/router';
import { LocalStorageManager } from './LocalStorageManager';
import { PlayerController } from './PlayerController';
import { updateClientSEO } from '../../lib/seo';

interface WatchPageProps {
  movieId: string;
  watchlist: Record<string, boolean>;
  onToggleWatchlist: (movie: MovieData) => void;
}

export const WatchPage: React.FC<WatchPageProps> = ({
  movieId,
  watchlist,
  onToggleWatchlist,
}) => {
  const [movie, setMovie] = React.useState<TMDBMovieDetails | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [loadRecommendations, setLoadRecommendations] = React.useState(false);
  const [activeServerId, setActiveServerId] = React.useState(() =>
    LocalStorageManager.getPreferredServer('server-a')
  );

  // Strip prefix "movie-" if present to get the raw TMDB ID
  const rawTmdbId = movieId.replace('movie-', '');

  const fetchMovieDetails = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const details = await movieService.getFullMovieDetails(rawTmdbId);
      setMovie(details);
    } catch (err: any) {
      console.error('Error fetching TMDB movie details for Watch page:', err);
      setError(err.message || 'The film details could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [rawTmdbId]);

  React.useEffect(() => {
    fetchMovieDetails();
    // Scroll to top when movie changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoadRecommendations(false);

    // Load recommendations after a short delay to keep player loading prioritized
    const timer = setTimeout(() => {
      setLoadRecommendations(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [movieId, fetchMovieDetails]);

  React.useEffect(() => {
    if (movie) {
      updateClientSEO({
        title: `Watch ${movie.title} - High Quality Stream on MoviyFly`,
        description: `Stream ${movie.title} full movie in premium HD quality. ${movie.overview || ''}`,
        image: movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : (movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined),
        type: 'video.movie',
        url: window.location.href
      });
    }
  }, [movie]);

  const handleToggleWatchlist = () => {
    if (!movie) return;
    const mapped = mapTMDBMovieToMovieData(movie);
    onToggleWatchlist(mapped);
  };

  const handleBackToDetails = () => {
    navigate(`/movie/movie-${rawTmdbId}`);
  };

  const handleBackToCatalog = () => {
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-8 py-6 select-none animate-pulse">
        {/* Back Link skeleton */}
        <div className="h-5 bg-white/[0.04] rounded-full w-32" />

        {/* Video Player Box skeleton */}
        <div className="w-full aspect-video rounded-[32px] bg-white/[0.02] border border-white/[0.04] flex items-center justify-center">
          <div className="text-center flex flex-col gap-3">
            <Monitor className="h-10 w-10 text-primary/40 animate-bounce mx-auto" />
            <span className="text-xs text-text-muted font-bold uppercase tracking-widest">
              Connecting to Stream Host...
            </span>
          </div>
        </div>

        {/* Actions metadata block skeleton */}
        <div className="p-8 rounded-3xl bg-[#13131A]/40 border border-white/[0.04] space-y-4">
          <div className="h-6 bg-white/[0.05] rounded-full w-1/3" />
          <div className="h-4 bg-white/[0.03] rounded-full w-1/4" />
          <div className="h-12 bg-white/[0.02] rounded-2xl w-full" />
        </div>
      </div>
    );
  }

  if (error || !movie) {
    const is404 = error?.includes('404') || !movie;

    return (
      <div className="w-full flex-grow flex items-center justify-center py-20 px-4 select-none">
        <div className="text-center max-w-md p-10 rounded-[32px] bg-card border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="mx-auto h-16 w-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
            <AlertTriangle className="h-7 w-7 text-red-500 animate-pulse" />
          </div>

          <h2 className="text-2xl font-extrabold text-white tracking-tight mb-3">
            {is404 ? 'Movie Stream Offline' : 'Connection Failure'}
          </h2>
          
          <p className="text-xs text-text-secondary leading-relaxed mb-8">
            {is404 
              ? 'The movie stream details could not be found in the system catalog. It may have been retired or you used an incorrect TMDB identifier.' 
              : `We encountered a connection issue syncing movie metadata with the TMDB server. Please try again.`
            }
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleBackToCatalog}
              className="flex-grow py-3 px-5 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 hover:border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              id="btn-watch-error-back"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Catalog</span>
            </button>
            
            {!is404 && (
              <button
                onClick={fetchMovieDetails}
                className="flex-grow py-3 px-5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold text-xs hover:opacity-90 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                id="btn-watch-error-retry"
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

  return (
    <div className="w-full max-w-8xl mx-auto py-4 space-y-8 select-none" id="watch-page-content-grid">
      {/* Dynamic breadcrumb navigation row */}
      <div className="flex items-center justify-between px-1">
        <button
          onClick={handleBackToDetails}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-primary transition-all cursor-pointer group"
          id="btn-watch-back-link"
        >
          <ChevronLeft className="h-4.5 w-4.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Movie Info</span>
        </button>

        <div className="flex items-center gap-2 text-[10px] font-extrabold text-text-muted uppercase tracking-wider">
          <Film className="h-3.5 w-3.5 text-primary animate-pulse" />
          <span>HD Streaming Theater</span>
        </div>
      </div>

      {/* Player Section */}
      <MoviePlayer
        tmdbId={rawTmdbId}
        title={movie.title}
        activeServerId={activeServerId}
        onBackToMovie={handleBackToDetails}
      />

      {/* Multi-Server Controller */}
      <PlayerController
        activeServerId={activeServerId}
        onServerChange={(serverId) => {
          setActiveServerId(serverId);
          LocalStorageManager.setPreferredServer(serverId);
        }}
      />

      {/* Details & Actions below player */}
      <WatchActions
        movie={movie}
        isInWatchlist={!!watchlist[movie.id]}
        onToggleWatchlist={handleToggleWatchlist}
        onBack={handleBackToDetails}
      />

      {/* Dynamic Recommendations & Similar Sections loaded after player to prioritize streaming */}
      {loadRecommendations && (
        <div className="space-y-12 pt-4 px-1 animate-fade-in">
          <div className="h-px bg-white/[0.04]" />

          {/* Recommendations Row */}
          <RecommendationRow
            movieId={movie.id}
            watchlist={watchlist}
            onPlayMovie={(m) => {
              navigate(`/watch/movie/${m.id.replace('movie-', '')}`);
            }}
            onMoreInfo={(m) => navigate(`/movie/${m.id}`)}
            onToggleWatchlist={onToggleWatchlist}
          />

          <div className="h-px bg-white/[0.04]" />

          {/* Similar Movies Row */}
          <SimilarMoviesRow
            movieId={movie.id}
            watchlist={watchlist}
            onPlayMovie={(m) => {
              navigate(`/watch/movie/${m.id.replace('movie-', '')}`);
            }}
            onMoreInfo={(m) => navigate(`/movie/${m.id}`)}
            onToggleWatchlist={onToggleWatchlist}
          />
        </div>
      )}
    </div>
  );
};
