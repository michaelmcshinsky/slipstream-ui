'use client';

import { useState } from 'react';

/**
 * Persistent banner shown while an admin is impersonating a user (KC-040).
 * Stop restores the parked admin session via the audited stop endpoint.
 */
export function ImpersonationBanner() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function stop() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/impersonate/stop', { method: 'POST' });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
        setError(body?.error?.message ?? 'Could not stop impersonating.');
        return;
      }
      window.location.href = '/admin/users';
    } catch {
      setError('Could not stop impersonating.');
    } finally {
      setPending(false);
    }
  }

  return (
    <div role="alert" className="border-b border-destructive/40 bg-destructive/10 px-4 py-2 text-sm">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-2">
        <span>
          You are impersonating a user. Everything you do is recorded in the audit log.
        </span>
        <span className="flex items-center gap-3">
          {error && <span className="text-destructive">{error}</span>}
          <button
            type="button"
            onClick={() => void stop()}
            disabled={pending}
            className="rounded-md bg-destructive px-3 py-1 font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            {pending ? 'Stopping…' : 'Stop impersonating'}
          </button>
        </span>
      </div>
    </div>
  );
}
