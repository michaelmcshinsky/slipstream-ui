export default function DocsLoading() {
  return (
    <div className="container mx-auto flex gap-8 px-4 py-10" aria-busy="true" aria-live="polite">
      <div className="hidden w-56 shrink-0 animate-pulse space-y-2 lg:block">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="h-4 rounded bg-muted" style={{ width: `${60 + ((index * 13) % 35)}%` }} />
        ))}
      </div>
      <div className="min-w-0 flex-1 animate-pulse space-y-4">
        <div className="h-9 w-1/2 rounded-md bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-40 rounded-xl bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
      </div>
      <span className="sr-only">Loading documentation…</span>
    </div>
  );
}
