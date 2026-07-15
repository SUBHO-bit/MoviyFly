import * as React from 'react';
import { ChevronLeft, Heart, Share2, Star, Calendar, Tv, Radio } from 'lucide-react';
import { TMDBTVDetails, TMDBEpisode } from '../../types/tv';
import { tvService } from '../../services/tv.service';

interface CurrentEpisodeProps {
  tvShow: TMDBTVDetails;
  seasonNumber: number;
  episodeNumber: number;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
  onBack: () => void;
}

export const CurrentEpisode: React.FC<CurrentEpisodeProps> = ({
  tvShow,
  seasonNumber,
  episodeNumber,
  isInWatchlist,
  onToggleWatchlist,
  onBack,
}) => {
  const [episodeDetails, setEpisodeDetails] = React.useState<TMDBEpisode | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    let active = true;
    const fetchEpisodeMetadata = async () => {
      setLoading(true);
      try {
        const seasonData = await tvService.getTVSeasonDetails(tvShow.id, seasonNumber);
        const match = seasonData.episodes?.find((ep) => ep.episode_number === episodeNumber);
        if (active) {
          setEpisodeDetails(match || null);
        }
      } catch (err) {
        console.error('Failed to load current episode metadata:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchEpisodeMetadata();
    return () => {
      active = false;
    };
  }, [tvShow.id, seasonNumber, episodeNumber]);

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/watch/tv/${tvShow.id}?season=${seasonNumber}&episode=${episodeNumber}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startYear = tvShow.first_air_date ? tvShow.first_air_date.split('-')[0] : 'N/A';
  const ratingValue = tvShow.vote_average ? tvShow.vote_average.toFixed(1) : '0.0';

  return (
    <div className="w-full bg-[#13131A] border border-white/[0.04] rounded-3xl p-6 md:p-8 space-y-6 text-left" id="current-episode-metadata-panel">
      {/* Primary header & action row */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-white/[0.04]">
        <div className="space-y-3 flex-grow max-w-4xl">
          {/* Metadata badges row */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-text-secondary">
            {/* Back to Details Button */}
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 text-xs font-black text-primary hover:text-accent transition-colors cursor-pointer mr-2"
              id="btn-back-to-tv-details"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Show Info</span>
            </button>

            {/* IMDb Rating */}
            <div className="flex items-center gap-1 bg-[#F5C518]/10 text-[#F5C518] px-2.5 py-1 rounded-full border border-[#F5C518]/20">
              <Star className="h-3 w-3 fill-[#F5C518]" />
              <span>{ratingValue} Rating</span>
            </div>

            {/* Release Year */}
            <div className="bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              <span>{startYear}</span>
            </div>

            {/* Season/Episode Identifier */}
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
              <Tv className="h-3 w-3" />
              <span>Season {seasonNumber}, Episode {episodeNumber}</span>
            </div>

            {/* Auto Play / Sync Status */}
            <div className="flex items-center gap-1 bg-[#22C55E]/10 text-[#22C55E] px-2.5 py-1 rounded-full border border-[#22C55E]/20 text-[10px] uppercase font-black tracking-wider">
              <Radio className="h-2.5 w-2.5 animate-pulse" />
              <span>Continue Watching Active</span>
            </div>
          </div>

          {/* Series & Episode Titles */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {tvShow.name}
            </h1>
            
            {loading ? (
              <div className="h-6 bg-white/[0.03] rounded-md w-1/2 animate-pulse mt-1" />
            ) : (
              <h2 className="text-base sm:text-lg font-black text-[#8B5CF6] tracking-tight">
                S{seasonNumber}:E{episodeNumber} — {episodeDetails?.name || `Episode ${episodeNumber}`}
              </h2>
            )}
          </div>
        </div>

        {/* Watchlist & Share Buttons */}
        <div className="flex items-center gap-3 shrink-0 select-none">
          {/* Watchlist toggle */}
          <button
            onClick={onToggleWatchlist}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs font-black transition-all cursor-pointer ${
              isInWatchlist
                ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
            id="btn-tv-toggle-watchlist"
          >
            <Heart className={`h-4 w-4 ${isInWatchlist ? 'fill-red-500' : ''}`} />
            <span>{isInWatchlist ? 'In Watchlist' : 'Add Watchlist'}</span>
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 text-xs font-black transition-all cursor-pointer relative"
            id="btn-tv-share"
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
            Episode Synopsis
          </h4>
          
          {loading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-3.5 bg-white/[0.03] rounded w-full" />
              <div className="h-3.5 bg-white/[0.03] rounded w-11/12" />
              <div className="h-3.5 bg-white/[0.03] rounded w-4/5" />
            </div>
          ) : (
            <p className="text-sm text-text-secondary leading-relaxed font-medium">
              {episodeDetails?.overview || tvShow.overview || 'No description is available for this episode.'}
            </p>
          )}

          {episodeDetails?.air_date && (
            <div className="flex items-center gap-2 text-xs font-bold text-text-muted select-none pt-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span>Broadcast Airdate: {new Date(episodeDetails.air_date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          )}
        </div>

        <div className="space-y-4 lg:border-l lg:border-white/[0.04] lg:pl-8">
          <h4 className="text-sm font-black text-white uppercase tracking-wider">
            Series Genres
          </h4>
          <div className="flex flex-wrap gap-2">
            {tvShow.genres?.map((genre) => (
              <span
                key={genre.id}
                className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/[0.04] text-text-secondary border border-white/[0.05]"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {tvShow.production_companies && tvShow.production_companies.length > 0 && (
            <div className="pt-2">
              <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">
                Network Production
              </h4>
              <p className="text-xs font-bold text-text-secondary truncate">
                {tvShow.production_companies.slice(0, 2).map((c) => c.name).join(', ')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
