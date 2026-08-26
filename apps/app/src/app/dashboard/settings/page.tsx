'use client';

import { useState } from 'react';
import { Card, CardTitle, Field } from '@/components/ui';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/auth/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.get('name') }),
    });
    if (!response.ok) {
      setError((await response.json()).error);
      return;
    }
    setMessage('Profile updated.');
    router.refresh();
  }

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const form = new FormData(event.currentTarget);
    const response = await fetch('/api/auth/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: form.get('current'),
        newPassword: form.get('next'),
        signOutOthers: form.get('signOutOthers') === 'on',
      }),
    });
    if (!response.ok) {
      setError((await response.json()).error);
      return;
    }
    setMessage('Password changed.');
    event.currentTarget.reset();
  }

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="text-2xl font-bold tracking-tight">Settings</h1>

      <Card>
        <CardTitle>Profile</CardTitle>
        <form onSubmit={updateProfile} className="space-y-4">
          <Field name="name" label="Display name" placeholder="Your name" />
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

      {message && <p role="status" className="text-sm text-primary">{message}</p>}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
