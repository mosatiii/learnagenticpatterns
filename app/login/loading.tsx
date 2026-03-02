export default function Loading() {
  return (
    <main className="relative z-10 pt-24 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4 animate-pulse">
        <div className="bg-surface border border-border rounded-lg p-8 space-y-5">
          <div className="h-7 w-40 rounded bg-surface/80" />
          <div className="h-4 w-56 rounded bg-surface/80" />
          <div className="space-y-4 mt-6">
            <div className="h-12 w-full rounded-md bg-surface/80" />
            <div className="h-12 w-full rounded-md bg-surface/80" />
            <div className="h-12 w-full rounded-md bg-primary/10" />
          </div>
        </div>
      </div>
    </main>
  );
}
