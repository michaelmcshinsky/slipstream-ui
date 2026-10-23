'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Card, CardTitle, inputClass } from '@/components/ui';
import { extractData, extractErrorMessage } from '@/lib/api/envelope';
import Link from 'next/link';

type Mode = 'login' | 'signup' | 'forgot' | 'reset';

const COPY: Record<Mode, { title: string; action: string; footer: [string, string] }> = {
  login: { title: 'Sign in', action: 'Sign in', footer: ['Need an account?', '/signup'] },
  signup: { title: 'Create your account', action: 'Create account', footer: ['Already have an account?', '/login'] },
  forgot: { title: 'Reset password', action: 'Send reset link', footer: ['Remembered it?', '/login'] },
  reset: { title: 'Choose a new password', action: 'Update password', footer: ['Back to', '/login'] },
};

/**
 * One form component for all four unauthenticated flows. The reset flow
 * reads ?token= from the URL; forgot returns the token inline in dev.
 */
export function AuthForm({ mode, token: initialToken }: { mode: Mode; token?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const copy = COPY[mode];

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setPending(true);

    const form = new FormData(event.currentTarget);
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
      const data = await response.json();
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
      if (mode === 'reset') {
        setNotice('Password updated. Redirecting…');
      }
      router.push('/dashboard');
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardTitle>{copy.title}</CardTitle>
      <form onSubmit={onSubmit} className="space-y-4">
        {mode === 'signup' && (
          <input name="name" placeholder="Your name" className={inputClass} autoComplete="name" />
        )}
        {mode !== 'reset' && (
          <input
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            className={inputClass}
            autoComplete="email"
          />
        )}
        {mode === 'reset' && !initialToken && (
          <input name="token" required placeholder="Reset token" className={inputClass} />
        )}
        {(mode === 'login' || mode === 'signup' || mode === 'reset') && (
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder={mode === 'reset' ? 'New password' : 'Password'}
            className={inputClass}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        )}

        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
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
        {copy.footer[0]}{' '}
        <Link href={copy.footer[1]} className="font-medium text-primary hover:underline">
          {mode === 'forgot' ? 'sign in' : 'sign in'}
        </Link>
      </p>
    </Card>
  );
}
