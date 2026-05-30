export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-md bg-white/55 ${className}`} />;
}

export function PageLoader() {
  return (
    <div className="min-h-screen app-bg grain flex items-center justify-center px-4">
      <div className="surface w-full max-w-md rounded-lg p-6">
        <Skeleton className="mb-5 h-6 w-36" />
        <Skeleton className="mb-3 h-10 w-4/5" />
        <Skeleton className="mb-8 h-4 w-2/3" />
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function RecommendationSkeleton() {
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-lg bg-ink p-5 shadow-lift">
        <Skeleton className="mb-5 h-7 w-48 bg-white/15" />
        {[0, 1, 2].map((item) => (
          <div key={item} className="mb-5 last:mb-0">
            <Skeleton className="mb-3 h-5 w-56 bg-white/15" />
            <Skeleton className="mb-3 h-3 w-full bg-white/15" />
            <Skeleton className="h-4 w-4/5 bg-white/15" />
          </div>
        ))}
      </section>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="surface rounded-lg p-5">
          <Skeleton className="mb-4 h-6 w-32" />
          <Skeleton className="mb-3 h-4 w-full" />
          <Skeleton className="mb-3 h-4 w-5/6" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="surface rounded-lg p-5">
          <Skeleton className="mb-4 h-6 w-28" />
          <Skeleton className="mb-3 h-4 w-full" />
          <Skeleton className="mb-3 h-4 w-4/5" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
