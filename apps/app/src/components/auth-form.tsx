'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardTitle, Field } from '@/components/ui';
import { extractData, extractErrorMessage } from '@/lib/api/envelope';
import { track } from '@/lib/analytics';
import Link from 'next/link';

type Mode = 'login' | 'signup' | 'forgot' | 'reset';

type FooterLink = { prompt: string; href: string; label: string };

const COPY: Record<Mode, { title: string; action: string; footer: FooterLink }> = {
  login: { title: 'Sign in', action: 'Sign in', footer: { prompt: 'Need an account?', href: '/signup', label: 'Create account' } },
  signup: { title: 'Create your account', action: 'Create account', footer: { prompt: 'Already have an account?', href: '/login', label: 'Sign in' } },
  forgot: { title: 'Reset password', action: 'Send reset link', footer: { prompt: 'Remembered it?', href: '/login', label: 'Sign in' } },
  reset: { title: 'Choose a new password', action: 'Update password', footer: { prompt: 'Back to', href: '/login', label: 'sign in' } },
};

function safeNext(next: string | undefined): string {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
}

/**
 * One form component for all four unauthenticated flows. The reset flow
 * reads ?token= from the URL; forgot returns the token inline in dev.
 */
export function AuthForm({ mode, token: initialToken, next }: { mode: Mode; token?: string; next?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const copy = COPY[mode];
  const errorProps = error ? { 'aria-invalid': true, 'aria-describedby': 'auth-error' } : {};

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setConfirmError(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
    if (mode === 'signup' && form.get('password') !== form.get('confirmPassword')) {
      setConfirmError('Passwords do not match.');
      setPending(false);
      return;
    }
    let endpoint = '/api/auth/login';
    let body: Record<string, unknown> = {};

    if (mode === 'login') {
      endpoint = '/api/auth/login';
      body = { email: form.get('email'), password: form.get('password') };
    } else if (mode === 'signup') {
      endpoint = '/api/auth/signup';
      body = { email: form.get('email'), name: form.get('name'), password: form.get('password') };
    } else if (mode === 'forgot') {
      endpoint = '/api/auth/forgot-password';
      body = { email: form.get('email') };
    } else {
      endpoint = '/api/auth/reset-password';
      body = { token: initialToken ?? form.get('token'), password: form.get('password') };
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setError(extractErrorMessage(data));
        return;
      }
      if (mode === 'forgot') {
        const resetToken = extractData<{ resetToken?: string }>(data)?.resetToken;
        setNotice(
          resetToken
            ? `Dev mode — reset token: ${resetToken}`
            : 'If that email exists, a reset link is on its way.'
        );
        return;
      }
      if (mode === 'signup') track('signup');
      if (mode === 'reset') {
        setNotice('Password updated. Redirecting…');
      }
      router.push(mode === 'login' || mode === 'signup' ? safeNext(next) : '/dashboard');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardTitle>{copy.title}</CardTitle>
      <form onSubmit={onSubmit} className="space-y-4">
        {mode === 'signup' && (
          <Field label="Name" name="name" autoComplete="name" {...errorProps} />
        )}
        {mode !== 'reset' && (
          <Field
            label="Email"
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            autoComplete="email"
            {...errorProps}
          />
        )}
        {mode === 'reset' && !initialToken && (
          <Field label="Reset token" name="token" required {...errorProps} />
        )}
        {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
          <Field
            label={mode === 'reset' ? 'New password' : 'Password'}
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            {...errorProps}
          />
        )}
        {mode === 'signup' && (
          <div className="space-y-1.5">
            <Field
              label="Confirm password"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              aria-invalid={Boolean(confirmError)}
              aria-describedby={confirmError ? 'confirm-password-error' : undefined}
            />
            {confirmError && (
              <p id="confirm-password-error" role="alert" className="text-sm text-destructive">
                {confirmError}
              </p>
            )}
          </div>
        )}

        {error && <p id="auth-error" role="alert" className="text-sm text-destructive">{error}</p>}
        {notice && <p role="status" className="text-sm text-primary">{notice}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {pending ? 'Working…' : copy.action}
        </button>
      </form>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        {copy.footer.prompt}{' '}
        <Link href={copy.footer.href} className="font-medium text-primary hover:underline">
          {copy.footer.label}
        </Link>
      </p>
      {mode === 'login' && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Forgot password?{' '}
          <Link href="/forgot-password" className="font-medium text-primary hover:underline">
            Reset it
          </Link>
        </p>
      )}
    </Card>
  );
}
