'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardTitle } from '@/components/ui';
import { extractErrorMessage } from '@/lib/api/envelope';

/**
 * Landing page for emailed invite links. The token arrives via ?token=; the
 * actual acceptance is a POST so scanners/prefetchers cannot consume it.
 */
export function InviteAcceptForm({ token }: { token: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function accept() {
    setError(null);
    setPending(true);
    try {
      const response = await fetch('/api/invites/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setError(extractErrorMessage(data));
        return;
      }
      router.push('/dashboard/team');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setPending(false);
    }
  }

  if (!token) {
    return (
      <Card className="w-full max-w-sm">
        <CardTitle>Invalid invite link</CardTitle>
        <p className="text-sm text-muted-foreground">This invitation link is missing its token.</p>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Link href="/dashboard" className="font-medium text-primary hover:underline">Back to dashboard</Link>
        </p>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm">
      <CardTitle>Team invitation</CardTitle>
      <p className="text-sm text-muted-foreground">
        Accept this invitation to join the team. The invite is bound to your account email.
      </p>
      {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      <button
        type="button"
        onClick={accept}
        disabled={pending}
        className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {pending ? 'Accepting…' : 'Accept invite'}
      </button>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        <Link href="/dashboard" className="font-medium text-primary hover:underline">Not now</Link>
      </p>
    </Card>
  );
}
