import * as React from 'react';
import { Play, ArrowRight, Clock } from 'lucide-react';
import { tvService } from '../../services/tv.service';
import { TMDBEpisode } from '../../types/tv';

interface NextEpisodeCardProps {
  tvId: string;
  currentSeason: number;
  currentEpisode: number;
  totalSeasons: number;
  onNavigateToNext: (season: number, episode: number) => void;
}

export const NextEpisodeCard: React.FC<NextEpisodeCardProps> = ({
  tvId,
  currentSeason,
  currentEpisode,
  totalSeasons,
  onNavigateToNext,
}) => {
  const [nextEpisode, setNextEpisode] = React.useState<TMDBEpisode | null>(null);
  const [nextSeasonNum, setNextSeasonNum] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    const checkNextEpisodeExistence = async () => {
      setLoading(true);
      setNextEpisode(null);
      setNextSeasonNum(null);
      try {
        // 1. Check if next episode exists in the current season
        const currentSeasonData = await tvService.getTVSeasonDetails(tvId, currentSeason);
        const nextInCurrent = currentSeasonData.episodes?.find(
          (ep) => ep.episode_number === currentEpisode + 1
        );

        if (nextInCurrent) {
          if (active) {
            setNextEpisode(nextInCurrent);
            setNextSeasonNum(currentSeason);
          }
          setLoading(false);
          return;
        }

        // 2. If not, check if there is a next season, and verify if Episode 1 exists in it
        if (currentSeason < totalSeasons) {
          const nextSeasonNumVal = currentSeason + 1;
          const nextSeasonData = await tvService.getTVSeasonDetails(tvId, nextSeasonNumVal);
          const firstInNext = nextSeasonData.episodes?.find(
            (ep) => ep.episode_number === 1
          );

          if (firstInNext && active) {
            setNextEpisode(firstInNext);
            setNextSeasonNum(nextSeasonNumVal);
          }
        }
      } catch (err) {
        console.error('Failed to verify next episode existence details:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    checkNextEpisodeExistence();
    return () => {
      active = false;
    };
  }, [tvId, currentSeason, currentEpisode, totalSeasons]);

  if (loading || !nextEpisode || nextSeasonNum === null) {
    return null; // Don't show anything if loading or if there's no next episode
  }

  const thumbnail = nextEpisode.still_path
    ? `https://image.tmdb.org/t/p/w500${nextEpisode.still_path}`
    : '';

  const durationLabel = nextEpisode.runtime ? `${nextEpisode.runtime}m` : '';

  return (
    <div
      className="bg-gradient-to-r from-primary/10 to-accent/5 border border-primary/20 rounded-[24px] p-6 flex flex-col md:flex-row items-center justify-between gap-6 text-left animate-slide-up"
      id="watch-next-episode-card"
    >
      <div className="flex flex-col md:flex-row items-center gap-5 w-full md:w-auto">
        {/* Thumbnail Preview */}
        <div className="relative w-full md:w-[180px] aspect-[16/9] rounded-xl overflow-hidden bg-black shrink-0 border border-white/[0.08] shadow-md select-none">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={nextEpisode.name || 'Next Episode'}
              referrerPolicy="no-referrer"
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/[0.02]">
              <Play className="h-5 w-5 text-primary/30" />
            </div>
          )}
          <div className="absolute top-2 left-2 bg-[#0B0B10]/80 backdrop-blur-md px-2 py-0.5 rounded text-[8px] font-black text-primary tracking-wider uppercase">
            UP NEXT
          </div>
        </div>

        {/* Content details */}
        <div className="space-y-1 w-full text-center md:text-left">
          <span className="text-[10px] font-black text-primary uppercase tracking-widest block">
            Up Next • Season {nextSeasonNum} Episode {nextEpisode.episode_number}
          </span>
          <h4 className="text-sm font-extrabold text-white tracking-tight line-clamp-1 leading-snug">
            {nextEpisode.name || `Episode ${nextEpisode.episode_number}`}
          </h4>
          <p className="text-xs text-text-secondary line-clamp-2 md:line-clamp-1 max-w-xl font-medium leading-relaxed">
            {nextEpisode.overview || 'Keep the story going. Stream the next episode instantly.'}
          </p>
          {durationLabel && (
            <div className="flex items-center justify-center md:justify-start gap-1 text-[10px] font-bold text-text-muted select-none pt-0.5">
              <Clock className="h-3 w-3 text-primary" />
              <span>{durationLabel} Duration</span>
            </div>
          )}
        </div>
      </div>

      {/* Play Action Trigger */}
      <button
        onClick={() => onNavigateToNext(nextSeasonNum, nextEpisode.episode_number)}
        className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-95 active:scale-95 text-xs font-black text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-purple-glow shrink-0"
        id="btn-play-next-episode"
      >
        <span>Stream Next Episode</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
};
