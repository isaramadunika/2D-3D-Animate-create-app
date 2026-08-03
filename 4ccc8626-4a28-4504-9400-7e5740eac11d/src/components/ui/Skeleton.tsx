import React from 'react';

interface Props {
  className?: string;
}

export function Skeleton({ className = '' }: Props) {
  return (
    <div
      aria-hidden
      className={`relative overflow-hidden rounded-xl bg-slate-200/70 ${className}`}>
      
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />
    </div>);

}

export function CardSkeleton() {
  return (
    <div className="glass rounded-3xl p-6 shadow-glass">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="mt-4 h-4 w-2/3" />
      <Skeleton className="mt-2 h-3 w-1/3" />
    </div>);

}