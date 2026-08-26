import Link from 'next/link';
import { getSessionUser } from '@/lib/session';

export default async function Home() {
  const user = await getSessionUser();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Slipstream Dashboard</h1>
      <p className="max-w-md text-muted-foreground">
        Manage your license, team, and billing for Slipstream UI Pro.
      </p>
      <div className="flex gap-3">
        {user ? (
          <Link href="/dashboard" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Open dashboard
          </Link>
        ) : (
          <>
            <Link href="/login" className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Sign in
            </Link>
            <Link href="/signup" className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted">
              Create account
            </Link>
          </>
        )}
        <Link href="/pricing" className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-muted">
          Pricing
        </Link>
      </div>
    </main>
  );
}
