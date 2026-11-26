'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardTitle } from '@/components/ui';
import { extractErrorMessage } from '@/lib/api/envelope';
import { track } from '@/lib/analytics';

/**
 * Explicit POST confirmation for emailed verification links:
 * opening the link never mutates state — the user presses "Verify email".
 */
function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [status, setStatus] = useState<'idle' | 'pending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [resend, setResend] = useState<'idle' | 'pending' | 'sent' | 'error'>('idle');
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  async function requestResend() {
    setResend('pending');
    setResendMessage(null);
    try {
      const response = await fetch('/api/auth/verify-email/resend', { method: 'POST' });
      if (response.status === 401) {
        setResend('idle');
        setResendMessage('Sign in first, then request a new link from your account.');
        return;
      }
      if (!response.ok) {
        setResend('error');
        setResendMessage('Could not send a new link. Try again in a moment.');
        return;
      }
      setResend('sent');
      setResendMessage('If your account is unverified, a new link is on its way.');
    } catch {
      setResend('error');
      setResendMessage('Could not reach the server. Check your connection and try again.');
    }
  }

  async function confirm() {
    setStatus('pending');
    setMessage(null);
    try {
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
      track('email_verified');
    } catch {
      setStatus('error');
      setMessage('Could not reach the server. Check your connection and try again.');
    }
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
          {!token && (
            <p role="alert" className="text-sm text-destructive">
              This verification link is incomplete — it is missing its token.{' '}
              <a href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </a>{' '}
              and request a new link below.
            </p>
          )}
          {message && (
            <p role="alert" className="text-sm text-destructive">
              {message}
              <br />
              <a href="/login" className="font-medium text-primary hover:underline">
                Sign in
              </a>{' '}
              and request a new link below if this one expired.
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
          <div className="border-t border-border pt-3">
            <button
              type="button"
              onClick={() => void requestResend()}
              disabled={resend === 'pending' || resend === 'sent'}
              className="w-full rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              {resend === 'pending' ? 'Sending…' : resend === 'sent' ? 'Link sent' : 'Resend verification email'}
            </button>
            {resendMessage && (
              <p role="status" className="mt-2 text-xs text-muted-foreground">
                {resendMessage}
              </p>
            )}
          </div>
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
