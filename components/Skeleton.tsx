export function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-surface/80 ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 space-y-4 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10" />
        <div className="h-4 w-24 rounded bg-surface/80" />
      </div>
      <div className="h-4 w-3/4 rounded bg-surface/80" />
      <div className="h-3 w-full rounded bg-surface/80" />
      <div className="h-3 w-2/3 rounded bg-surface/80" />
    </div>
  );
}

export function SkeletonPatternPage() {
  return (
    <main className="relative z-10 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar skeleton */}
          <aside className="hidden lg:block">
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-9 rounded bg-surface/80"
                />
              ))}
            </div>
          </aside>
          {/* Content skeleton */}
          <div className="space-y-6">
            <div className="h-5 w-48 rounded bg-surface/80" />
            <div className="h-10 w-3/4 rounded bg-surface/80" />
            <div className="h-5 w-1/2 rounded bg-primary/10" />
            <div className="space-y-3 mt-8">
              <div className="h-4 w-full rounded bg-surface/80" />
              <div className="h-4 w-full rounded bg-surface/80" />
              <div className="h-4 w-5/6 rounded bg-surface/80" />
              <div className="h-4 w-2/3 rounded bg-surface/80" />
            </div>
            <div className="h-48 w-full rounded-lg bg-surface/80 mt-8" />
          </div>
        </div>
      </div>
    </main>
  );
}

export function SkeletonHomepage() {
  return (
    <main className="relative z-10 animate-pulse">
      {/* Hero skeleton */}
      <section className="min-h-[60vh] flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="space-y-6 max-w-2xl">
            <div className="h-4 w-32 rounded bg-surface/80" />
            <div className="h-12 w-3/4 rounded bg-surface/80" />
            <div className="h-12 w-1/2 rounded bg-surface/80" />
            <div className="h-5 w-full rounded bg-surface/80" />
            <div className="h-5 w-2/3 rounded bg-surface/80" />
            <div className="flex gap-4 mt-8">
              <div className="h-12 w-40 rounded-md bg-primary/10" />
              <div className="h-12 w-48 rounded-md bg-surface/80" />
            </div>
          </div>
        </div>
      </section>
      {/* Grid skeleton */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-48 rounded bg-surface/80 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
