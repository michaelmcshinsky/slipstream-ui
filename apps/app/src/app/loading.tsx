export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-5xl animate-pulse space-y-4 px-4 py-10" aria-busy="true" aria-live="polite">
      <div className="h-8 w-1/3 rounded-md bg-muted" />
      <div className="h-4 w-2/3 rounded bg-muted" />
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="h-28 rounded-xl bg-muted" />
        <div className="h-28 rounded-xl bg-muted" />
        <div className="h-28 rounded-xl bg-muted" />
      </div>
      <div className="h-64 rounded-xl bg-muted" />
      <span className="sr-only">Loading…</span>
    </main>
  );
}
