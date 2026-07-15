import * as React from 'react';

export const MediaLoading: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 py-6 select-none animate-pulse">
      {/* Back Link skeleton */}
      <div className="h-5 bg-white/[0.04] rounded-full w-32" />

      {/* Hero banner skeleton */}
      <div className="w-full h-[450px] md:h-[550px] rounded-[32px] bg-white/[0.02] border border-white/[0.04] flex items-end p-8 md:p-12">
        <div className="flex gap-10 items-end w-full">
          <div className="hidden md:block w-[220px] aspect-[2/3] bg-white/[0.03] rounded-[24px]" />
          <div className="flex-grow space-y-4">
            <div className="h-10 bg-white/[0.05] rounded-full w-1/2" />
            <div className="h-4 bg-white/[0.03] rounded-full w-1/3" />
            <div className="space-y-2 pt-4">
              <div className="h-3 bg-white/[0.02] rounded-full w-full" />
              <div className="h-3 bg-white/[0.02] rounded-full w-5/6" />
              <div className="h-3 bg-white/[0.02] rounded-full w-2/3" />
            </div>
          </div>
        </div>
      </div>

      {/* Cast & Crew row skeleton */}
      <div className="space-y-4">
        <div className="h-6 bg-white/[0.04] rounded-full w-44" />
        <div className="flex gap-4 overflow-hidden pb-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex-shrink-0 w-32 sm:w-36 flex flex-col gap-3">
              <div className="w-full aspect-[2/3] bg-white/[0.02] border border-white/[0.04] rounded-2xl" />
              <div className="h-3.5 bg-white/[0.04] rounded-full w-2/3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
