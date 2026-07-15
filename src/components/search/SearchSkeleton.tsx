import * as React from 'react';

export const SearchSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 w-full py-2 animate-pulse" id="search-skeleton">
      {Array.from({ length: 10 }).map((_, idx) => (
        <div key={idx} className="flex flex-col gap-3 p-3.5 bg-[#18181C]/40 border border-white/[0.04] rounded-[24px]">
          {/* Card Poster Area */}
          <div className="relative h-[190px] sm:h-[240px] md:h-[260px] w-full rounded-[20px] bg-white/[0.04]" />
          {/* Metadata Block */}
          <div className="flex flex-col gap-2 pt-1">
            <div className="h-4 w-3/4 bg-white/[0.06] rounded" />
            <div className="h-3 w-1/2 bg-white/[0.04] rounded" />
            <div className="flex gap-2 pt-1">
              <div className="h-4 w-12 bg-white/[0.04] rounded-full" />
              <div className="h-4 w-12 bg-white/[0.04] rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
