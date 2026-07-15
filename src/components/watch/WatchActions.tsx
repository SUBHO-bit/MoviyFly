import * as React from 'react';
import { ChevronLeft, Heart, Share2, Star, Clock } from 'lucide-react';
import { TMDBMovieDetails } from '../../types/movie';

interface WatchActionsProps {
  movie: TMDBMovieDetails;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
  onBack: () => void;
}

export const WatchActions: React.FC<WatchActionsProps> = ({
  movie,
  isInWatchlist,
  onToggleWatchlist,
  onBack,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    // Generate the watch link for sharing
    const shareUrl = `${window.location.origin}/watch/movie/${movie.id.toString().replace('movie-', '')}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

  // Format runtime
  let formattedRuntime = 'N/A';
  if ((movie as any).formattedRuntime) {
    formattedRuntime = (movie as any).formattedRuntime;
  } else if (movie.runtime) {
    const hours = Math.floor(movie.runtime / 60);
    const mins = movie.runtime % 60;
    formattedRuntime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  }

  const ratingValue = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';

  return (
    <div className="w-full bg-[#13131A] border border-white/[0.04] rounded-3xl p-6 md:p-8 space-y-6 text-left" id="watch-actions-panel">
      {/* Primary header & action row */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-white/[0.04]">
        <div className="space-y-3 flex-grow max-w-4xl">
          {/* Metadata badges row */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-text-secondary">
            {/* Back to Details Button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 text-xs font-black text-primary hover:text-accent transition-colors cursor-pointer mr-2"
              id="btn-back-to-details"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Movie Info</span>
            </button>

            {/* IMDb Rating */}
            <div className="flex items-center gap-1 bg-[#F5C518]/10 text-[#F5C518] px-2.5 py-1 rounded-full border border-[#F5C518]/20">
              <Star className="h-3 w-3 fill-[#F5C518]" />
              <span>{ratingValue} Rating</span>
            </div>

            {/* Release Year */}
            <div className="bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              <span>{releaseYear}</span>
            </div>

            {/* Runtime */}
            <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              <Clock className="h-3 w-3" />
              <span>{formattedRuntime}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-none">
            {movie.title}
          </h1>

          {movie.tagline && (
            <p className="text-sm font-medium text-primary/80 italic">
              "{movie.tagline}"
            </p>
          )}
        </div>

        {/* Watchlist & Share Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Watchlist toggle */}
          <button
            onClick={onToggleWatchlist}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-black transition-all cursor-pointer ${
              isInWatchlist
                ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
            id="btn-watch-toggle-watchlist"
          >
            <Heart className={`h-4 w-4 ${isInWatchlist ? 'fill-red-500' : ''}`} />
            <span>{isInWatchlist ? 'In Watchlist' : 'Add Watchlist'}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 text-xs font-black transition-all cursor-pointer relative"
            id="btn-watch-share"
          >
            <Share2 className="h-4 w-4" />
            <span>Share Stream</span>

            {copied && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white font-bold text-[10px] px-2.5 py-1 rounded shadow-md pointer-events-none whitespace-nowrap animate-fade-in">
                Link Copied!
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Genres and description */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="space-y-4">
          <h4 className="text-sm font-black text-white uppercase tracking-wider">
            Story Outline
          </h4>
          <p className="text-sm text-text-secondary leading-relaxed font-medium">
            {movie.overview || 'No story details or overview is available for this title.'}
          </p>
        </div>

        <div className="space-y-4 lg:border-l lg:border-white/[0.04] lg:pl-8">
          <h4 className="text-sm font-black text-white uppercase tracking-wider">
            Genres
          </h4>
          <div className="flex flex-wrap gap-2">
            {movie.genres?.map((genre) => (
              <span
                key={genre.id}
                className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.04] text-text-secondary border border-white/[0.05]"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {movie.production_companies && movie.production_companies.length > 0 && (
            <div className="pt-2">
              <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">
                Production
              </h4>
              <p className="text-xs font-bold text-text-secondary truncate">
                {movie.production_companies.slice(0, 2).map((c) => c.name).join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
