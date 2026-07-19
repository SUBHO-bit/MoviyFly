import * as React from 'react';
import { Play, Calendar, Clock } from 'lucide-react';
import { TMDBEpisode } from '../../types/tv';
import { getStillUrl } from '../../config/tmdb';

interface EpisodeCardProps {
  episode: TMDBEpisode;
  onPlay: (episodeNumber: number) => void;
}

export const EpisodeCard: React.FC<EpisodeCardProps> = ({
  episode,
  onPlay,
}) => {
  const thumbnail = getStillUrl(episode.still_path);

  const airYear = episode.air_date ? new Date(episode.air_date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }) : 'N/A';

  const formattedRuntime = episode.runtime 
    ? `${episode.runtime}m` 
    : 'N/A';

  return (
    <div
      onClick={() => onPlay(episode.episode_number)}
      className="group bg-[#141419] border border-white/[0.04] hover:border-primary/20 rounded-[20px] p-4 flex flex-col md:flex-row items-start gap-5 transition-all duration-300 hover:scale-[1.01] hover:bg-[#181822] cursor-pointer"
      id={`episode-card-${episode.episode_number}`}
    >
      {/* Thumbnail Aspect Container */}
      <div className="relative w-full md:w-[240px] shrink-0 aspect-[16/9] rounded-xl overflow-hidden bg-white/[0.01] border border-white/[0.06] shadow-md select-none">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={episode.name || `Episode ${episode.episode_number}`}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-white/[0.02] text-text-muted gap-2">
            <Play className="h-6 w-6 opacity-30" />
            <span className="text-[10px] font-bold uppercase tracking-wider">No Still Available</span>
          </div>
        )}

        {/* Play Icon Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="h-10 w-10 rounded-full bg-[#8B5CF6] flex items-center justify-center text-white shadow-lg shadow-purple-glow transform scale-90 group-hover:scale-100 transition-transform duration-300">
            <Play className="h-4.5 w-4.5 fill-white text-white ml-0.5" />
          </div>
        </div>

        {/* Episode Number Pill */}
        <div className="absolute top-3 left-3 bg-[#0B0B10]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
          <span className="text-[10px] font-black text-[#A855F7] uppercase tracking-wider">
            EPISODE {episode.episode_number}
          </span>
        </div>
      </div>

      {/* Episode Narrative details */}
      <div className="flex-grow flex flex-col gap-2.5 text-left h-full justify-between py-1">
        <div>
          {/* Header row with Title and duration info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 select-none">
            <h3 className="text-sm font-extrabold text-white group-hover:text-[#8B5CF6] transition-colors leading-snug line-clamp-1">
              {episode.episode_number}. {episode.name || `Episode ${episode.episode_number}`}
            </h3>
            
            <div className="flex items-center gap-3 text-[11px] font-bold text-text-secondary select-none shrink-0">
              {episode.runtime && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-primary" />
                  {formattedRuntime}
                </span>
              )}
              {episode.air_date && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-primary" />
                  {airYear}
                </span>
              )}
            </div>
          </div>

          {/* Overview summary */}
          <p className="text-xs text-text-secondary leading-relaxed mt-2.5 line-clamp-2 md:line-clamp-3 font-medium">
            {episode.overview || 'No description is available for this episode.'}
          </p>
        </div>

        {/* Streaming integration action */}
        <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-primary uppercase tracking-wider mt-2 select-none">
          <span>Stream Episode Now</span>
          <Play className="h-2.5 w-2.5 fill-primary text-primary animate-pulse" />
        </div>
      </div>
    </div>
  );
};
