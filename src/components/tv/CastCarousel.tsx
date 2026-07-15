import * as React from 'react';
import { User } from 'lucide-react';
import { tvService } from '../../services/tv.service';
import { getPosterUrl } from '../../config/tmdb';

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface CastCarouselProps {
  tvId: string | number;
}

export const CastCarousel: React.FC<CastCarouselProps> = ({ tvId }) => {
  const [cast, setCast] = React.useState<CastMember[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;
    const fetchCast = async () => {
      setLoading(true);
      try {
        const response = await tvService.getTVCredits(tvId);
        if (active) {
          setCast(response.cast ? response.cast.slice(0, 12) : []);
        }
      } catch (err) {
        console.error('Error fetching TV credits:', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchCast();
    return () => {
      active = false;
    };
  }, [tvId]);

  if (loading) {
    return (
      <div className="space-y-4 text-left" id="cast-carousel-loading">
        <h3 className="text-base font-extrabold text-white tracking-tight">Cast</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 custom-scroll-area select-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-[120px] sm:w-[140px] shrink-0 space-y-3 animate-pulse">
              <div className="aspect-[3/4] rounded-2xl bg-white/[0.03] w-full" />
              <div className="h-3 bg-white/[0.03] rounded-md w-3/4 mx-auto" />
              <div className="h-2.5 bg-white/[0.03] rounded-md w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (cast.length === 0) return null;

  return (
    <div className="space-y-4 text-left" id="cast-carousel-section">
      <h3 className="text-base font-extrabold text-white tracking-tight">Cast</h3>
      
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scroll-area select-none snap-x">
        {cast.map((member, idx) => {
          const profileImg = getPosterUrl(member.profile_path);
          return (
            <div
              key={`${member.id || 'cast'}-${idx}`}
              className="w-[120px] sm:w-[140px] shrink-0 bg-[#141419] border border-white/[0.04] p-2.5 rounded-2xl text-center flex flex-col justify-between transition-transform duration-300 hover:scale-[1.03] snap-start"
            >
              {/* Profile Image Frame */}
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-white/[0.02] border border-white/5 relative mb-2.5">
                {member.profile_path ? (
                  <img
                    src={profileImg}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-white/[0.01]">
                    <User className="h-6 w-6 text-text-muted" />
                  </div>
                )}
              </div>

              {/* Names */}
              <div className="px-1 min-h-[44px] flex flex-col justify-center">
                <span className="block text-[11px] font-black text-white truncate" title={member.name}>
                  {member.name}
                </span>
                <span className="block text-[10px] font-semibold text-text-muted mt-0.5 truncate" title={member.character}>
                  {member.character}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
