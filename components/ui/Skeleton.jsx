'use client';

import { cn } from '@/lib/utils';

export default function Skeleton({ className = '', width, height, rounded = false }) {
  return (
    <div
      className={cn('skeleton', rounded && 'rounded-full', className)}
      style={{
        width: width || '100%',
        height: height || '20px',
      }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-4">
      <Skeleton height="14px" width="40%" />
      <Skeleton height="32px" width="60%" />
      <Skeleton height="12px" width="80%" />
      <Skeleton height="8px" width="100%" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height="14px" width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </div>
  );
}
