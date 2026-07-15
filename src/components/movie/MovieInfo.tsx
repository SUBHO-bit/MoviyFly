import * as React from 'react';
import { DollarSign, Landmark, Globe2, Sparkles, Milestone, ThumbsUp, Layers } from 'lucide-react';
import { TMDBMovieDetails } from '../../types/movie';

interface MovieInfoProps {
  movie: TMDBMovieDetails;
}

export const MovieInfo: React.FC<MovieInfoProps> = ({ movie }) => {
  const formatCurrency = (value: number) => {
    if (!value || value === 0) return 'Not Disclosed';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const infoItems = [
    {
      label: 'Budget',
      value: formatCurrency(movie.budget),
      icon: <DollarSign className="h-4.5 w-4.5 text-green-400" />,
    },
    {
      label: 'Revenue',
      value: formatCurrency(movie.revenue),
      icon: <Milestone className="h-4.5 w-4.5 text-purple-400" />,
    },
    {
      label: 'Production Countries',
      value: movie.production_countries?.map((c) => c.name).join(', ') || 'N/A',
      icon: <Globe2 className="h-4.5 w-4.5 text-blue-400" />,
    },
    {
      label: 'Spoken Languages',
      value: movie.spoken_languages?.map((l) => l.english_name || l.name).join(', ') || 'N/A',
      icon: <Layers className="h-4.5 w-4.5 text-orange-400" />,
    },
    {
      label: 'Popularity Score',
      value: movie.popularity ? movie.popularity.toFixed(1) : 'N/A',
      icon: <Sparkles className="h-4.5 w-4.5 text-yellow-400" />,
    },
    {
      label: 'Vote Count',
      value: movie.vote_count ? new Intl.NumberFormat('en-US').format(movie.vote_count) : 'N/A',
      icon: <ThumbsUp className="h-4.5 w-4.5 text-teal-400" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 select-none">
      {/* Left Column: Production details and Companies */}
      <div className="space-y-6">
        <div className="p-6 sm:p-8 rounded-[24px] bg-[#141419] border border-white/[0.04] space-y-6">
          <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Landmark className="h-5 w-5 text-primary" />
            <span>Production Companies</span>
          </h3>
          
          {movie.production_companies && movie.production_companies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {movie.production_companies.map((company, idx) => (
                <div
                  key={`${company.id || 'company'}-${idx}`}
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/10 hover:bg-white/[0.03] transition-all"
                >
                  {/* Logo or Placeholder */}
                  <div className="h-10 w-10 flex-shrink-0 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden p-1">
                    {company.logo_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                        alt={company.name}
                        referrerPolicy="no-referrer"
                        className="max-h-full max-w-full object-contain filter invert"
                        loading="lazy"
                      />
                    ) : (
                      <Landmark className="h-4 w-4 text-text-muted" />
                    )}
                  </div>
                  
                  {/* Name and Origin */}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{company.name}</p>
                    <p className="text-[10px] text-text-secondary truncate mt-0.5 font-semibold">
                      {company.origin_country || 'Global'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-text-secondary">No production company records found for this movie.</p>
          )}
        </div>
      </div>

      {/* Right Column: Numeric & Financial metrics */}
      <div className="p-6 sm:p-8 rounded-[24px] bg-[#141419] border border-white/[0.04] h-full flex flex-col justify-between">
        <div className="space-y-5">
          <h3 className="text-lg font-bold text-white tracking-tight mb-2">Movie Metrics</h3>
          <div className="space-y-4">
            {infoItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b border-white/[0.03] last:border-0"
              >
                <div className="flex items-center gap-2.5 text-xs text-text-secondary font-semibold">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                <span className="text-xs font-bold text-white text-right max-w-[180px] truncate">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
