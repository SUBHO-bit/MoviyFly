import * as React from 'react';
import { EpisodeCard } from './EpisodeCard';
import { tvService } from '../../services/tv.service';
import { TMDBEpisode } from '../../types/tv';
import { Clapperboard, HelpCircle } from 'lucide-react';

interface EpisodeListProps {
  tvId: string | number;
  seasonNumber: number;
  onPlayEpisode: (episodeNumber: number) => void;
}

export const EpisodeList: React.FC<EpisodeListProps> = ({
  tvId,
  seasonNumber,
  onPlayEpisode,
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
        console.error('Error fetching season details:', err);
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
      <div className="space-y-4 pt-4" id="episodes-loading">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white/[0.02] border border-white/[0.04] rounded-[20px] p-4 flex flex-col md:flex-row items-start gap-5 animate-pulse">
            <div className="w-full md:w-[240px] shrink-0 aspect-[16/9] rounded-xl bg-white/[0.03]" />
            <div className="flex-grow space-y-3 w-full py-1">
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
      <div className="flex flex-col items-center justify-center py-12 text-center" id="episodes-error">
        <div className="mx-auto h-12 w-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
          <HelpCircle className="h-6 w-6 text-red-500" />
        </div>
        <h4 className="text-sm font-bold text-white mb-1">Guide Unavailable</h4>
        <p className="text-xs text-text-muted max-w-sm leading-relaxed">
          {error}
        </p>
      </div>
    );
  }

  if (episodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center" id="episodes-empty">
        <div className="mx-auto h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <Clapperboard className="h-6 w-6 text-text-secondary animate-pulse" />
        </div>
        <h4 className="text-sm font-bold text-white mb-1">No Episodes</h4>
        <p className="text-xs text-text-muted">
          There are no episodes announced yet for this season.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 pt-4" id="episodes-list">
      {episodes.map((episode) => (
        <EpisodeCard
          key={episode.id}
          episode={episode}
          onPlay={onPlayEpisode}
        />
      ))}
    </div>
  );
};
