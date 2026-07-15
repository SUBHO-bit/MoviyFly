import * as React from 'react';

export const MovieRowSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 animate-pulse select-none">
      {/* Row Title Skeleton */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <div className="h-5 w-1 rounded bg-white/[0.08]" />
          <div className="h-4 w-36 rounded bg-white/[0.08]" />
        </div>
        <div className="h-3 w-12 rounded bg-white/[0.08]" />
      </div>

      {/* Row Horizontal Items Skeletons */}
      <div className="flex gap-5 md:gap-6 overflow-x-hidden pb-5 pt-1.5 px-1.5">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="w-[170px] sm:w-[210px] md:w-[230px] shrink-0 flex flex-col gap-3">
            {/* Poster Card Aspect Ratio Matches h-[210px]/[260px]/[290px] */}
            <div className="relative h-[210px] sm:h-[260px] md:h-[290px] w-full rounded-[20px] bg-white/[0.04] border border-white/[0.04]" />
            {/* Meta Skeletons */}
            <div className="flex flex-col gap-2 pt-2">
              <div className="h-4 w-3/4 rounded bg-white/[0.06]" />
              <div className="h-3 w-1/2 rounded bg-white/[0.04]" />
              <div className="flex gap-1.5 mt-1">
                <div className="h-4 w-12 rounded bg-white/[0.04]" />
                <div className="h-4 w-12 rounded bg-white/[0.04]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
