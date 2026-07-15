"use client";

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/80 overflow-hidden">
      <div className="aspect-[4/3] bg-zinc-200 dark:bg-zinc-800" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-10 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
        <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-3 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="flex gap-3">
          <div className="h-3 w-1/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-1/4 rounded bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-[4/3] rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        <div className="space-y-4">
          <div className="h-8 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-1/4 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-10 w-32 rounded-lg bg-zinc-200 dark:bg-zinc-800 mt-4" />
        </div>
      </div>
    </div>
  );
}
