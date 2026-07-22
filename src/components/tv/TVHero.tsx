import * as React from 'react';
import { Play, Heart, Share2, Star, Clock, Globe, CalendarCheck, Tv } from 'lucide-react';
import { TMDBTVDetails } from '../../types/tv';
import { getBackdropUrl, getPosterUrl, getLogoUrl } from '../../config/tmdb';
import { TrailerButton } from '../movie/TrailerButton';

interface TVHeroProps {
  tvShow: TMDBTVDetails;
  isInWatchlist: boolean;
  onToggleWatchlist: () => void;
  onWatchNow: () => void;
}

export const TVHero: React.FC<TVHeroProps> = ({
  tvShow,
  isInWatchlist,
  onToggleWatchlist,
  onWatchNow,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const backdropUrl = getBackdropUrl(tvShow.backdrop_path);
  const posterUrl = getPosterUrl(tvShow.poster_path);
  
  const startYear = tvShow.first_air_date ? tvShow.first_air_date.split('-')[0] : 'N/A';
  const endYear = tvShow.status === 'Ended' && tvShow.last_air_date
    ? tvShow.last_air_date.split('-')[0]
    : 'Present';

  const yearsLabel = tvShow.status === 'Ended' || tvShow.last_air_date
    ? `${startYear} - ${endYear}`
    : startYear;

  const seasonsLabel = tvShow.number_of_seasons > 1 
    ? `${tvShow.number_of_seasons} Seasons` 
    : `${tvShow.number_of_seasons || 1} Season`;

  const ratingValue = tvShow.vote_average ? tvShow.vote_average.toFixed(1) : '0.0';

  return (
    <div className="relative w-full min-h-[500px] md:min-h-[600px] lg:min-h-[650px] rounded-[32px] overflow-hidden bg-[#070709] border border-white/[0.04] shadow-2xl flex flex-col justify-end p-6 sm:p-10 md:p-12" id="tv-hero">
      {/* Background Backdrop Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={backdropUrl}
          alt={tvShow.name || 'TV Backdrop'}
          referrerPolicy="no-referrer"
          loading="eager"
          decoding="async"
          fetchPriority="high"
          width={1280}
          height={720}
          className="w-full h-full object-cover opacity-35 object-top select-none"
        />
        {/* Cinematic multi-stop gradient mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B10] via-[#0B0B10]/80 to-[#0B0B10]/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B10] via-[#0B0B10]/60 to-transparent" />
      </div>

      {/* Hero Content Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[250px_1fr] lg:grid-cols-[280px_1fr] gap-8 md:gap-10 items-end max-w-7xl w-full mx-auto">
        {/* Poster (Hidden on extra small devices, nicely floating on tablet+) */}
        <div className="hidden md:block w-full aspect-[2/3] rounded-[24px] overflow-hidden bg-card border border-white/[0.08] shadow-2xl group cursor-pointer select-none">
          <img
            src={posterUrl}
            alt={tvShow.name || 'TV Poster'}
            referrerPolicy="no-referrer"
            loading="eager"
            decoding="async"
            width={342}
            height={513}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        </div>

        {/* Narrative Details */}
        <div className="flex flex-col gap-6 text-left">
          {/* Metadata Badges / Pathing Row */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-text-secondary select-none">
            {/* IMDb Rating Badge */}
            <div className="flex items-center gap-1 bg-[#F5C518]/10 text-[#F5C518] px-2.5 py-1 rounded-full border border-[#F5C518]/20 shadow-sm">
              <Star className="h-3.5 w-3.5 fill-[#F5C518]" />
              <span>{ratingValue} IMDb</span>
            </div>

            {/* Years Range */}
            <div className="bg-white/5 px-2.5 py-1 rounded-full border border-white/5 flex items-center gap-1.5">
              <span>{yearsLabel}</span>
            </div>

            {/* Seasons Count */}
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
              <Tv className="h-3 w-3" />
              <span>{seasonsLabel}</span>
            </div>

            {/* Episodes Count */}
            <div className="bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              <span>{tvShow.number_of_episodes || 0} Episodes</span>
            </div>

            {/* Original Language */}
            <div className="bg-white/5 px-2.5 py-1 rounded-full border border-white/5 uppercase">
              <span>{tvShow.original_language || 'EN'}</span>
            </div>

            {/* Status */}
            {tvShow.status && (
              <div className="bg-[#22C55E]/10 text-[#22C55E] px-2.5 py-1 rounded-full border border-[#22C55E]/20">
                <span>{tvShow.status}</span>
              </div>
            )}
          </div>

          {/* Title and Tagline */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-none">
              {tvShow.name}
            </h1>
            {tvShow.type && (
              <p className="text-xs font-semibold text-[#8B5CF6] uppercase tracking-widest">
                {tvShow.type}
              </p>
            )}
          </div>

          {/* Genres Pills Row */}
          <div className="flex flex-wrap gap-2 select-none">
            {tvShow.genres?.map((genre) => (
              <span
                key={genre.id}
                className="text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full bg-white/[0.04] text-text-secondary border border-white/[0.05] hover:border-primary/30 hover:bg-primary/5 transition-all"
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Core Overview */}
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-3xl font-medium">
            {tvShow.overview || 'No description is available for this title.'}
          </p>

          {/* Network Logos & Created By info */}
          <div className="flex flex-wrap items-center gap-6 pt-1 text-xs font-bold text-text-muted">
            {/* Created By */}
            {tvShow.created_by && tvShow.created_by.length > 0 && (
              <div className="flex items-center gap-2">
                <span>Created By:</span>
                <span className="text-white font-semibold">
                  {tvShow.created_by.map(creator => creator.name).join(', ')}
                </span>
              </div>
            )}

            {/* Networks */}
            {tvShow.production_companies && tvShow.production_companies.length > 0 && (
              <div className="flex items-center gap-3">
                <span>Networks:</span>
                <div className="flex items-center gap-3">
                  {tvShow.production_companies.slice(0, 3).map((company, idx) => (
                    company.logo_path ? (
                      <div key={`${company.id || 'company'}-${idx}`} className="bg-white/5 rounded-md px-1.5 py-0.5 h-6 flex items-center justify-center border border-white/5" title={company.name}>
                        <img
                          src={getLogoUrl(company.logo_path, 'w92')}
                          alt={company.name}
                          className="h-4 object-contain brightness-100"
                        />
                      </div>
                    ) : (
                      <span key={`${company.id || 'company'}-${idx}`} className="text-white text-[11px] font-bold">
                        {company.name}
                      </span>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Actions Row */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            {/* Watch Now Button */}
            <button
              onClick={onWatchNow}
              className="flex items-center gap-2.5 px-7 py-3 rounded-full bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-extrabold text-sm shadow-purple-glow transition-all active:scale-95 cursor-pointer"
              id="btn-watch-now"
            >
              <Play className="h-4 w-4 fill-white text-white" />
              <span>Watch Now</span>
            </button>

            {/* Trailer embed button helper */}
            <TrailerButton movieId={`tv-${tvShow.id}`} />

            {/* Add to Watchlist Button */}
            <button
              onClick={onToggleWatchlist}
              className={`flex items-center justify-center p-3 rounded-full border transition-all active:scale-90 cursor-pointer ${
                isInWatchlist
                  ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20'
                  : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
              }`}
              title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              aria-label="Toggle watchlist"
              id="btn-toggle-watchlist"
            >
              <Heart className={`h-4.5 w-4.5 ${isInWatchlist ? 'fill-red-500' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="flex items-center justify-center p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white transition-all active:scale-90 cursor-pointer relative"
              title="Copy Link to Share"
              aria-label="Share show link"
              id="btn-share-show"
            >
              <Share2 className="h-4.5 w-4.5" />
              {copied && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white font-bold text-[10px] px-2 py-1 rounded shadow-md pointer-events-none whitespace-nowrap animate-fade-in">
                  Link Copied!
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
