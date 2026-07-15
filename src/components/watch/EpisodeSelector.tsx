import * as React from 'react';
import { Play, Clock, Calendar, HelpCircle, Loader2 } from 'lucide-react';
import { tvService } from '../../services/tv.service';
import { TMDBEpisode } from '../../types/tv';

interface EpisodeSelectorProps {
  tvId: string;
  seasonNumber: number;
  currentEpisodeNumber: number;
  onEpisodeSelect: (episodeNumber: number) => void;
}

export const EpisodeSelector: React.FC<EpisodeSelectorProps> = ({
  tvId,
  seasonNumber,
  currentEpisodeNumber,
  onEpisodeSelect,
}) => {
  const [episodes, setEpisodes] = React.useState<TMDBEpisode[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    const fetchSeasonEpisodes = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await tvService.getTVSeasonDetails(tvId, seasonNumber);
        if (active) {
          setEpisodes(data.episodes || []);
        }
      } catch (err: any) {
        console.error('Error fetching season details for episode list:', err);
        if (active) {
          setError('Failed to retrieve the episode guide for this season.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchSeasonEpisodes();
    return () => {
      active = false;
    };
  }, [tvId, seasonNumber]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 pt-2" id="episodes-loading-skeleton">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/[0.04] rounded-[20px] p-4 flex flex-col md:flex-row items-start gap-5 animate-pulse">
            <div className="w-full md:w-[240px] shrink-0 aspect-[16/9] rounded-xl bg-white/[0.03]" />
            <div className="flex-grow space-y-3 w-full py-1 text-left">
              <div className="h-4 bg-white/[0.03] rounded-md w-1/3" />
              <div className="h-3 bg-white/[0.03] rounded-md w-1/4" />
              <div className="h-3 bg-white/[0.03] rounded-md w-full" />
              <div className="h-3 bg-white/[0.03] rounded-md w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center" id="episodes-load-error">
        <div className="mx-auto h-12 w-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <HelpCircle className="h-6 w-6 text-red-500 animate-bounce" />
        </div>
        <h4 className="text-sm font-bold text-white mb-1">Guide Unavailable</h4>
        <p className="text-xs text-text-muted max-w-sm leading-relaxed font-medium">
          {error}
        </p>
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center" id="episodes-load-empty">
        <div className="mx-auto h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Play className="h-5 w-5 text-text-secondary opacity-40 animate-pulse" />
        </div>
        <h4 className="text-sm font-bold text-white mb-1">No Episodes Announced</h4>
        <p className="text-xs text-text-muted font-medium">
          There are no episodes listed yet for this season.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 pt-2" id="watch-episodes-listing">
      {episodes.map((episode) => {
        const isPlaying = episode.episode_number === currentEpisodeNumber;
        const thumbnail = episode.still_path 
          ? `https://image.tmdb.org/t/p/w500${episode.still_path}`
          : '';

        const airDateStr = episode.air_date 
          ? new Date(episode.air_date).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : 'N/A';

        const runtimeLabel = episode.runtime ? `${episode.runtime}m` : 'N/A';

        return (
          <div
            key={episode.id}
            onClick={() => onEpisodeSelect(episode.episode_number)}
            className={`group border rounded-[20px] p-4 flex flex-col md:flex-row items-start gap-5 transition-all duration-300 hover:scale-[1.01] cursor-pointer text-left ${
              isPlaying
                ? 'bg-[#181826] border-primary/40 shadow-lg shadow-primary/5'
                : 'bg-[#141419] border-white/[0.04] hover:border-primary/20 hover:bg-[#181822]'
            }`}
            id={`watch-episode-card-${episode.episode_number}`}
            role="button"
            tabIndex={0}
            aria-label={`Play Season ${episode.season_number} Episode ${episode.episode_number}: ${episode.name || 'Untitled Episode'}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onEpisodeSelect(episode.episode_number);
              }
            }}
          >
            {/* Episode Thumbnail Container */}
            <div className="relative w-full md:w-[220px] shrink-0 aspect-[16/9] rounded-xl overflow-hidden bg-white/[0.01] border border-white/[0.06] shadow-md select-none">
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
                  <span className="text-[9px] font-black uppercase tracking-wider">No Still Available</span>
                </div>
              )}

              {/* Play Action Overlay */}
              <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center ${
                isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}>
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white shadow-lg transform transition-transform duration-300 ${
                  isPlaying 
                    ? 'bg-primary shadow-purple-glow scale-100'
                    : 'bg-[#8B5CF6] scale-90 group-hover:scale-100'
                }`}>
                  <Play className={`h-4.5 w-4.5 fill-white text-white ${isPlaying ? 'animate-pulse ml-0.5' : 'ml-0.5'}`} />
                </div>
              </div>

              {/* Episode Badge label */}
              <div className="absolute top-3 left-3 bg-[#0B0B10]/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                <span className={`text-[9px] font-black uppercase tracking-wider ${isPlaying ? 'text-[#8B5CF6]' : 'text-[#A855F7]'}`}>
                  EP {episode.episode_number}
                </span>
              </div>
            </div>

            {/* Episode Metadata Details */}
            <div className="flex-grow flex flex-col gap-2.5 justify-between py-0.5 h-full">
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
                  <h3 className={`text-sm font-extrabold tracking-tight leading-snug line-clamp-1 transition-colors ${
                    isPlaying ? 'text-[#8B5CF6]' : 'text-white group-hover:text-[#8B5CF6]'
                  }`}>
                    {episode.episode_number}. {episode.name || `Episode ${episode.episode_number}`}
                  </h3>

                  <div className="flex items-center gap-3 text-[10px] font-black text-text-secondary shrink-0 select-none">
                    {episode.runtime && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-primary" />
                        {runtimeLabel}
                      </span>
                    )}
                    {episode.air_date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-primary" />
                        {airDateStr}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed mt-2 line-clamp-2 md:line-clamp-3 font-medium">
                  {episode.overview || 'No descriptive overview is available for this episode.'}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest mt-1 select-none">
                {isPlaying ? (
                  <span className="text-[#8B5CF6] animate-pulse">Now Streaming Live</span>
                ) : (
                  <span>Click to Stream Episode</span>
                )}
                <Play className={`h-2.5 w-2.5 fill-primary text-primary ${isPlaying ? 'animate-bounce' : ''}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
