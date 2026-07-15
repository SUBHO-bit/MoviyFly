import * as React from 'react';
import { Play, X, Clapperboard } from 'lucide-react';
import { movieService } from '../../services/movie.service';
import { tvService } from '../../services/tv.service';

interface TrailerButtonProps {
  movieId: string | number;
}

export const TrailerButton: React.FC<TrailerButtonProps> = ({ movieId }) => {
  const [videoKey, setVideoKey] = React.useState<string | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const isTv = String(movieId).startsWith('tv-');
        const response = isTv 
          ? await tvService.getTVVideos(movieId)
          : await movieService.getMovieVideos(movieId);

        if (!active) return;
        
        // Find official trailer on YouTube
        const videos = response.results || [];
        const trailer = videos.find(
          (v) => v.site.toLowerCase() === 'youtube' && v.type.toLowerCase() === 'trailer' && v.official
        ) || videos.find(
          (v) => v.site.toLowerCase() === 'youtube' && v.type.toLowerCase() === 'trailer'
        ) || videos.find(
          (v) => v.site.toLowerCase() === 'youtube' && (v.type.toLowerCase() === 'teaser' || v.type.toLowerCase() === 'clip')
        );

        if (trailer) {
          setVideoKey(trailer.key);
        } else {
          setVideoKey(null);
        }
      } catch (e) {
        console.warn('Failed to load movie trailer:', e);
        setVideoKey(null);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchVideos();
    return () => {
      active = false;
    };
  }, [movieId]);

  if (loading || !videoKey) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 hover:border-white/25 text-white font-semibold text-sm transition-all active:scale-95 cursor-pointer"
        id="btn-watch-trailer"
      >
        <Clapperboard className="h-4.5 w-4.5 text-text-secondary" />
        <span>Watch Trailer</span>
      </button>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          {/* Modal content container */}
          <div 
            className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden bg-card border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white/80 hover:text-white transition-all border border-white/5 cursor-pointer"
              aria-label="Close trailer modal"
              id="btn-close-trailer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* YouTube embed */}
            <iframe
              title="Movie Trailer"
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1&rel=0`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  );
};
