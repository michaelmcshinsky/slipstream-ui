import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        That route doesn&apos;t exist. Check the URL, or head back to your dashboard.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Link href="/dashboard" className="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Go to dashboard
        </Link>
        <Link href="/" className="inline-flex h-10 items-center rounded-md border border-border px-5 text-sm font-medium hover:bg-accent">
          Home
        </Link>
      </div>
    </main>
  );
}
