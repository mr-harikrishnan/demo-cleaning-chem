import React from 'react';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`shimmer rounded-[10px] bg-[#F1F4F9] ${className}`}
        />
      ))}
    </>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-[16px] border border-[#E6EAF2] p-4 flex flex-col gap-4 shadow-cleantec-sm"
        >
          <div className="w-full aspect-[4/5] rounded-[12px] shimmer bg-[#F1F4F9]" />
          <div className="h-4 w-1/3 shimmer bg-[#F1F4F9] rounded-[6px]" />
          <div className="h-6 w-3/4 shimmer bg-[#F1F4F9] rounded-[6px]" />
          <div className="h-4 w-full shimmer bg-[#F1F4F9] rounded-[6px]" />
          <div className="mt-auto pt-4 border-t border-[#E6EAF2] flex justify-between items-center">
            <div className="h-6 w-1/4 shimmer bg-[#F1F4F9] rounded-[6px]" />
            <div className="h-10 w-28 shimmer bg-[#F1F4F9] rounded-[10px]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full bg-white rounded-[16px] border border-[#E6EAF2] overflow-hidden shadow-cleantec-sm">
      {/* Table Header skeleton */}
      <div className="h-12 bg-[#F8FAFC] border-b border-[#E6EAF2] px-6 flex items-center justify-between gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 w-24 shimmer bg-[#E2E8F0] rounded-[6px]" />
        ))}
      </div>
      {/* Table Body rows */}
      <div className="divide-y divide-[#E6EAF2]">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="h-14 px-6 flex items-center justify-between gap-4">
            {Array.from({ length: cols }).map((_, c) => (
              <div
                key={c}
                className="h-4 shimmer bg-[#F1F4F9] rounded-[6px]"
                style={{ width: `${Math.max(40, 20 + ((r * 17 + c * 23) % 60))}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
