'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardTitle } from '@/components/ui';
import { extractData, extractErrorMessage } from '@/lib/api/envelope';

type InvitePreview = {
  teamName: string;
  role: string;
  email: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired';
};

type State =
  | { kind: 'loading' }
  | { kind: 'missing-token' }
  | { kind: 'not-found' }
  | { kind: 'ready'; invite: InvitePreview }
  | { kind: 'unauthenticated'; token: string }
  | { kind: 'accepted' }
  | { kind: 'error'; message: string };

export function InviteAcceptForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!token) {
      setState({ kind: 'missing-token' });
      return;
    }
    let cancelled = false;
    fetch(`/api/invites/preview?token=${encodeURIComponent(token)}`)
      .then(async (response) => {
        if (response.status === 401) {
          if (!cancelled) setState({ kind: 'unauthenticated', token });
          return;
        }
        const body: unknown = await response.json().catch(() => null);
        const invite = extractData<{ invite: InvitePreview | null }>(body)?.invite ?? null;
        if (!cancelled) setState(invite ? { kind: 'ready', invite } : { kind: 'not-found' });
      })
      .catch(() => {
        if (!cancelled) setState({ kind: 'error', message: 'Could not load the invitation. Check your connection and try again.' });
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function accept() {
    setPending(true);
    try {
      const response = await fetch('/api/invites/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const body: unknown = await response.json().catch(() => null);
      if (response.status === 401) {
        setState({ kind: 'unauthenticated', token });
        return;
      }
      if (!response.ok) {
        setState({ kind: 'error', message: extractErrorMessage(body, 'Could not accept this invitation.') });
        return;
      }
      setState({ kind: 'accepted' });
    } catch {
      setState({ kind: 'error', message: 'Could not reach the server. Check your connection and try again.' });
    } finally {
      setPending(false);
    }
  }

  const loginHref = `/login?next=${encodeURIComponent(`/invite/accept?token=${token}`)}`;

  return (
    <Card className="w-full max-w-sm">
      <CardTitle>Team invitation</CardTitle>
      {state.kind === 'loading' && <p className="text-sm text-muted-foreground">Loading invitation…</p>}

      {state.kind === 'missing-token' && (
        <p role="alert" className="text-sm text-destructive">
          This invitation link is incomplete — it is missing its token. Ask the sender for a new link.
        </p>
      )}

      {state.kind === 'not-found' && (
        <p role="alert" className="text-sm text-destructive">
          This invitation link is invalid. It may have been revoked — ask the team owner for a new one.
        </p>
      )}

      {state.kind === 'unauthenticated' && (
        <>
          <p className="text-sm text-muted-foreground">
            You need to sign in before accepting this invitation.
          </p>
          <Link
            href={loginHref}
            className="mt-4 block w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign in to continue
          </Link>
        </>
      )}

      {state.kind === 'ready' && (
        <>
          <p className="text-sm">
            <span className="font-medium">{state.invite.teamName}</span> invited{' '}
            <span className="font-medium">{state.invite.email}</span> to join as{' '}
            <span className="font-medium">{state.invite.role}</span>.
          </p>
          {state.invite.status !== 'pending' ? (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {state.invite.status === 'accepted'
                ? 'This invitation has already been accepted.'
                : 'This invitation has expired. Ask the team owner for a new link.'}
            </p>
          ) : (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => void accept()}
                disabled={pending}
                className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {pending ? 'Accepting…' : 'Accept invitation'}
              </button>
              <Link
                href="/dashboard"
                className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted"
              >
                Decline
              </Link>
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Expires {new Date(state.invite.expiresAt).toLocaleDateString()}.
          </p>
        </>
      )}

      {state.kind === 'accepted' && (
        <p role="status" className="text-sm">
          Invitation accepted.{' '}
          <Link href="/dashboard/team" className="font-medium text-primary hover:underline">
            Open your team
          </Link>
          .
        </p>
      )}

      {state.kind === 'error' && (
        <p role="alert" className="text-sm text-destructive">
          {state.message}
        </p>
      )}
    </Card>
  );
}
