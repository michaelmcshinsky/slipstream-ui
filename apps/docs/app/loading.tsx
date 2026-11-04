export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-background" aria-busy="true" aria-live="polite">
      <div className="h-14 border-b border-border" />
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-2xl animate-pulse space-y-4">
          <div className="h-8 w-2/3 rounded-md bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-5/6 rounded bg-muted" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="h-32 rounded-xl bg-muted" />
            <div className="h-32 rounded-xl bg-muted" />
            <div className="h-32 rounded-xl bg-muted" />
            <div className="h-32 rounded-xl bg-muted" />
          </div>
        </div>
      </div>
      <span className="sr-only">Loading page…</span>
    </div>
  );
}
