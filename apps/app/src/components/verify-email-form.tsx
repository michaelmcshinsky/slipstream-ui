'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardTitle } from '@/components/ui';
import { extractErrorMessage } from '@/lib/api/envelope';

/**
 * Explicit POST confirmation for emailed verification links (KC-040):
 * opening the link never mutates state — the user presses "Verify email".
 */
function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [status, setStatus] = useState<'idle' | 'pending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);

  async function confirm() {
    setStatus('pending');
    setMessage(null);
    const response = await fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus('error');
      setMessage(extractErrorMessage(body, 'This verification link is invalid or has expired.'));
      return;
    }
    setStatus('done');
  }

  return (
    <Card className="w-full max-w-sm">
      <CardTitle>Verify your email</CardTitle>
      {status === 'done' ? (
        <p role="status" className="text-sm">
          Your email is verified.{' '}
          <a href="/login" className="font-medium text-primary hover:underline">
            Continue to sign in
          </a>
          .
        </p>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">
            Confirm your email address to accept team invitations.
          </p>
          {message && (
            <p role="alert" className="text-sm text-destructive">
              {message}
              <br />
              <a href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </a>{' '}
              and request a new link from your account if this one expired.
            </p>
          )}
          <button
            type="button"
            onClick={() => void confirm()}
            disabled={!token || status === 'pending'}
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {status === 'pending' ? 'Verifying…' : 'Verify email'}
          </button>
        </>
      )}
    </Card>
  );
}

export function VerifyEmailForm() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailInner />
    </Suspense>
  );
}
