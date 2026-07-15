import * as React from 'react';
import { TMDBTVDetails } from '../../types/tv';
import { Globe, Shield, CalendarCheck, HelpCircle, Layers, TrendingUp, ThumbsUp } from 'lucide-react';

interface SeriesInfoProps {
  tvShow: TMDBTVDetails;
}

export const SeriesInfo: React.FC<SeriesInfoProps> = ({ tvShow }) => {
  const infoItems = [
    {
      label: 'Type',
      value: tvShow.type || 'N/A',
      icon: <Layers className="h-4 w-4 text-primary" />,
    },
    {
      label: 'Status',
      value: tvShow.status || 'N/A',
      icon: <CalendarCheck className="h-4 w-4 text-primary" />,
    },
    {
      label: 'Languages',
      value: tvShow.languages?.map(l => l.toUpperCase()).join(', ') || tvShow.original_language?.toUpperCase() || 'EN',
      icon: <Globe className="h-4 w-4 text-primary" />,
    },
    {
      label: 'Popularity Score',
      value: tvShow.popularity ? `${tvShow.popularity.toFixed(1)} pts` : 'N/A',
      icon: <TrendingUp className="h-4 w-4 text-primary" />,
    },
    {
      label: 'Total Reviews',
      value: tvShow.vote_count ? `${tvShow.vote_count.toLocaleString()} votes` : 'N/A',
      icon: <ThumbsUp className="h-4 w-4 text-primary" />,
    },
  ];

  return (
    <div className="bg-[#141419] border border-white/[0.04] rounded-3xl p-6 sm:p-8" id="series-info-card">
      <h3 className="text-base font-extrabold text-white tracking-tight mb-6">
        Series Information
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Core items list */}
        {infoItems.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.04]">
              {item.icon}
            </div>
            <div className="text-left">
              <span className="block text-[11px] font-black uppercase text-text-muted tracking-wider">
                {item.label}
              </span>
              <span className="block text-sm font-extrabold text-white mt-0.5">
                {item.value}
              </span>
            </div>
          </div>
        ))}

        {/* Dynamic Items: Created By */}
        {tvShow.created_by && tvShow.created_by.length > 0 && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.04]">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <span className="block text-[11px] font-black uppercase text-text-muted tracking-wider">
                Created By
              </span>
              <span className="block text-sm font-extrabold text-white mt-0.5">
                {tvShow.created_by.map(c => c.name).join(', ')}
              </span>
            </div>
          </div>
        )}

        {/* Homepage Item */}
        {tvShow.homepage && (
          <div className="flex items-start gap-3 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.04]">
              <Globe className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left max-w-full">
              <span className="block text-[11px] font-black uppercase text-text-muted tracking-wider">
                Official Website
              </span>
              <a
                href={tvShow.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm font-extrabold text-primary hover:underline mt-0.5 truncate max-w-xs"
              >
                {tvShow.homepage.replace(/^https?:\/\/(www\.)?/, '')}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Production Details Sub-Row */}
      {(tvShow.production_companies && tvShow.production_companies.length > 0) && (
        <div className="mt-8 pt-6 border-t border-white/[0.05] text-left">
          <span className="block text-[11px] font-black uppercase text-text-muted tracking-wider mb-4">
            Production & Distribution
          </span>
          <div className="flex flex-wrap gap-4 items-center">
            {tvShow.production_companies.map((company) => (
              <span
                key={company.id}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.03] text-white font-extrabold text-xs border border-white/[0.04]"
              >
                {company.name} {company.origin_country ? `(${company.origin_country})` : ''}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
