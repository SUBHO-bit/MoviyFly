import * as React from 'react';
import { ChevronLeft, Tv } from 'lucide-react';
import { MediaItem } from '../../types/media';
import { MediaHero } from './MediaHero';
import { MediaCast } from './MediaCast';
import { MediaRecommendations } from './MediaRecommendations';
import { SeasonSelector } from '../tv/SeasonSelector';
import { EpisodeList } from '../tv/EpisodeList';
import { SeriesInfo } from '../tv/SeriesInfo';
import { MovieData } from '../movie/MovieCard';
import { navigate } from '../../lib/router';

interface MediaDetailsLayoutProps {
  media: MediaItem;
  watchlist: Record<string, boolean>;
  onToggleWatchlist: (movie: MovieData) => void;
}

export const MediaDetailsLayout: React.FC<MediaDetailsLayoutProps> = ({
  media,
  watchlist,
  onToggleWatchlist,
}) => {
  const [season, setSeason] = React.useState(1);

  const rawTmdbId = media.id.replace('movie-', '').replace('tv-', '');

  const handleToggleWatchlist = () => {
    const mapped: MovieData = {
      id: media.id,
      title: media.title,
      overview: media.overview,
      genres: media.genres ? media.genres.map(g => g.name) : [],
      rating: media.rating,
      year: media.releaseDate ? media.releaseDate.split('-')[0] : 'N/A',
      runtime: media.runtime,
      language: media.language,
      ageRating: media.ageRating || 'PG-13',
      poster: media.poster,
      backdrop: media.backdrop,
    };
    onToggleWatchlist(mapped);
  };

  const handleBackToCatalog = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate(media.mediaType === 'tv' ? '/tvshows' : '/home');
    }
  };

  const handleWatchNow = () => {
    if (media.mediaType === 'tv') {
      navigate(`/watch/tv/${rawTmdbId}?season=${season}&episode=1`);
    } else {
      navigate(`/watch/movie/${rawTmdbId}`);
    }
  };

  const handlePlayEpisode = (episodeNumber: number) => {
    navigate(`/watch/tv/${rawTmdbId}?season=${season}&episode=${episodeNumber}`);
  };

  const isInWatchlist = !!watchlist[media.id];

  return (
    <div className="w-full select-none flex flex-col bg-[#0B0B10] overflow-x-hidden">
      {/* Floating Hero Section & Breadcrumb Navigation */}
      <div className="relative w-full">
        {/* Unified Hero Banner Section */}
        <MediaHero
          media={media}
          isInWatchlist={isInWatchlist}
          onToggleWatchlist={handleToggleWatchlist}
          onWatchNow={handleWatchNow}
        />

        {/* Path Breadcrumb & Navigation Trigger Row - Floating absolute on top of the hero */}
        <div className="absolute top-24 left-4 md:left-[5%] lg:left-[6%] right-4 md:right-[5%] lg:right-[6%] z-30 flex items-center justify-between select-none pointer-events-none">
          <button
            onClick={handleBackToCatalog}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-white bg-black/40 hover:bg-[#8B5CF6]/20 px-4 py-2 rounded-full border border-white/5 hover:border-[#8B5CF6]/30 backdrop-blur-md transition-all duration-300 cursor-pointer group pointer-events-auto shadow-lg animate-fade-in"
            id="btn-details-back"
          >
            <ChevronLeft className="h-4.5 w-4.5 transition-transform group-hover:-translate-x-0.5" />
            <span>Back</span>
          </button>

          {media.mediaType === 'tv' && (
            <div className="flex items-center gap-2 text-[10px] font-extrabold text-text-muted uppercase tracking-wider bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md animate-fade-in">
              <Tv className="h-3 w-3 text-[#8B5CF6]" />
              <span>TV Series Space</span>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Sub-sections Layout */}
      {media.mediaType === 'tv' ? (
        <div className="space-y-12 px-4 md:px-8 max-w-7xl mx-auto pb-16 w-full pt-12">
          {/* Season Selection & Episode listings */}
          <div className="w-full space-y-4">
            <SeasonSelector
              totalSeasons={media.seasonCount || 1}
              currentSeason={season}
              onSeasonChange={(s) => setSeason(s)}
            />

            <EpisodeList
              tvId={rawTmdbId}
              seasonNumber={season}
              onPlayEpisode={handlePlayEpisode}
            />
          </div>

          {/* Grid Layout split for Production Details and Cast listings */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
            {/* Cast Carousel */}
            <div className="space-y-8">
              <MediaCast mediaId={media.id} />
            </div>

            {/* Series Extra Metadata Block */}
            <SeriesInfo tvShow={media as any} />
          </div>

          {/* Parallel Row recommendations and similarity sections */}
          <div className="space-y-12 pt-8">
            <MediaRecommendations
              mediaId={media.id}
              mediaType="tv"
              type="recommendations"
              onPlayMovie={(m) => navigate(`/tv/${m.id}`)}
              onMoreInfo={(m) => navigate(`/tv/${m.id}`)}
              onToggleWatchlist={onToggleWatchlist}
              watchlist={watchlist}
            />

            <MediaRecommendations
              mediaId={media.id}
              mediaType="tv"
              type="similar"
              onPlayMovie={(m) => navigate(`/tv/${m.id}`)}
              onMoreInfo={(m) => navigate(`/tv/${m.id}`)}
              onToggleWatchlist={onToggleWatchlist}
              watchlist={watchlist}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-12 px-4 md:px-8 max-w-7xl mx-auto pb-16 w-full pt-12">
          {/* Cast Members Carousel */}
          <MediaCast mediaId={media.id} />
        </div>
      )}
    </div>
  );
};
