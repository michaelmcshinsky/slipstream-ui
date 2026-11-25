'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled render error', error);
  }, [error]);

  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-sm text-muted-foreground">Error</p>
      <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
      <p className="max-w-md text-muted-foreground">
        An unexpected error occurred while rendering this page. Try again, or head back to your
        dashboard.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try again
        </button>
        <a
          href="/dashboard"
          className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium hover:bg-accent"
        >
          Go to dashboard
        </a>
      </div>
    </main>
  );
}
