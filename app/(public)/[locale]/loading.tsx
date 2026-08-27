export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-label="Loading page"
      className="min-h-screen px-[var(--section-space-x)] pb-[var(--section-space-y)] pt-8"
    >
      <div className="mx-auto max-w-[var(--container)]">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="h-10 w-40 animate-pulse rounded-full bg-white/[0.06]" />
          <div className="h-9 w-24 animate-pulse rounded-full bg-white/[0.05]" />
        </div>
        <div className="grid gap-8 py-20 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <div className="h-3 w-36 animate-pulse rounded-full bg-accent/20" />
            <div className="h-28 max-w-2xl animate-pulse rounded-2xl bg-white/[0.07]" />
            <div className="h-16 max-w-xl animate-pulse rounded-2xl bg-white/[0.05]" />
            <div className="flex gap-3">
              <div className="h-12 w-40 animate-pulse rounded-full bg-accent/20" />
              <div className="h-12 w-36 animate-pulse rounded-full bg-white/[0.06]" />
            </div>
          </div>
          <div className="aspect-[4/4.9] w-full animate-pulse rounded-[1.2rem] border border-border bg-white/[0.04]" />
        </div>
        <span className="sr-only" role="status">
          Loading
        </span>
      </div>
    </main>
  );
}
