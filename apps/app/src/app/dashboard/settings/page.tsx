'use client';

import { useEffect, useState } from 'react';
import { Card, CardTitle, Field } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { extractData, extractErrorMessage } from '@/lib/api/envelope';

export default function SettingsPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data: unknown) => {
        const user = extractData<{ user?: { name?: string | null; email?: string } }>(data)?.user;
        setName(user?.name ?? '');
        setEmail(user?.email ?? '');
      })
      .catch(() => {});
  }, []);

  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    try {
      const response = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setError(extractErrorMessage(data));
        return;
      }
      setMessage('Profile updated.');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: form.get('current'),
          newPassword: form.get('next'),
          signOutOthers: form.get('signOutOthers') === 'on',
        }),
      });
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setError(extractErrorMessage(data));
        return;
      }
      setMessage('Password changed.');
      event.currentTarget.reset();
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  async function deleteAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (!window.confirm('This permanently deletes your account and cannot be undone. Continue?')) return;
    try {
      const response = await fetch('/api/account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmEmail, password: password || undefined }),
      });
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setError(extractErrorMessage(data));
        return;
      }
      window.location.href = '/';
    } catch {
      setError('Something went wrong. Please try again.');
    }
  }

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

      <Card>
        <CardTitle>Profile</CardTitle>
        <form onSubmit={updateProfile} className="space-y-4">
          <Field name="name" label="Display name" placeholder="Your name" value={name} onChange={(event) => setName(event.target.value)} />
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Save profile
          </button>
        </form>
      </Card>

      <Card>
        <CardTitle>Change password</CardTitle>
        <form onSubmit={changePassword} className="space-y-4">
          <Field name="current" label="Current password" type="password" required autoComplete="current-password" />
          <Field
            name="next"
            label="New password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" name="signOutOthers" defaultChecked />
            Sign out all other devices
          </label>
          <button type="submit" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Update password
          </button>
        </form>
      </Card>

      <Card>
        <CardTitle>Privacy</CardTitle>
        <p className="text-sm text-muted-foreground">
          See what this dashboard stores and how it is used.{' '}
          <a href="/privacy" className="text-primary underline underline-offset-2 hover:text-primary/80">
            Privacy overview
          </a>
          {' · '}
          <a href="/terms" className="text-primary underline underline-offset-2 hover:text-primary/80">
            Terms of Service
          </a>
          {' · '}
          <a href="/accessibility" className="text-primary underline underline-offset-2 hover:text-primary/80">
            Accessibility
          </a>
        </p>
      </Card>

      <Card>
        <CardTitle>Your data</CardTitle>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Download a copy of the data associated with your account, or delete your
            account and everything tied to it.
          </p>
          <a
            href="/api/account/export"
            className="inline-block rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Export my data (JSON)
          </a>
        </div>
      </Card>

      <Card>
        <CardTitle>Delete account</CardTitle>
        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="rounded-md border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            Delete my account…
          </button>
        ) : (
          <form onSubmit={deleteAccount} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This permanently deletes your account, sessions, API keys, licenses and
              newsletter data. Payment and audit records are retained with your
              identity removed. Type your email{email ? ` (${email})` : ''} and
              password to confirm.
            </p>
            <Field
              name="confirmEmail"
              label="Confirm email"
              type="email"
              required
              autoComplete="off"
              value={confirmEmail}
              onChange={(event) => setConfirmEmail(event.target.value)}
            />
            <Field
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90"
              >
                Permanently delete
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmDelete(false);
                  setConfirmEmail('');
                  setPassword('');
                }}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Card>

      {message && <p role="status" className="text-sm text-primary">{message}</p>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
