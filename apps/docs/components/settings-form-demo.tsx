'use client';

import { useState } from 'react';
import { Button, FormField, Input, Switch } from '@slipstream-ui/core';

interface FormErrors {
  name?: string;
  email?: string;
}

/**
 * Live demo of the settings form template: FormField error wiring, switch
 * rows, and a success state — all validation runs client-side.
 */
export function SettingsFormDemo() {
  const [name, setName] = useState('Ada Lovelace');
  const [email, setEmail] = useState('not-an-email');
  const [notify, setNotify] = useState(true);
  const [digest, setDigest] = useState(true);
  const [errors, setErrors] = useState<FormErrors>({});
  const [saved, setSaved] = useState(false);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!name.trim()) next.name = 'Display name is required';
    if (!email) next.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (validate()) setSaved(true);
  }

  if (saved) {
    return (
      <div className="w-full max-w-md space-y-3 rounded-xl border border-border bg-card p-6" role="status">
        <p className="font-medium">Settings saved.</p>
        <p className="text-sm text-muted-foreground">
          {name} · {email} · notifications {notify ? 'on' : 'off'} · weekly digest{' '}
          {digest ? 'on' : 'off'}
        </p>
        <Button size="sm" variant="outline" onClick={() => setSaved(false)}>
          Edit again
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-6">
      <FormField id="sf-name" label="Display name" error={errors.name} required>
        <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
      </FormField>
      <FormField
        id="sf-email"
        label="Email"
        error={errors.email}
        hint="Used for account notices — never shared."
        required
      >
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </FormField>

      <div className="divide-y divide-border rounded-lg border border-border">
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <div>
            <label htmlFor="sf-notify" className="block text-sm font-medium">
              Email notifications
            </label>
            <p className="text-xs text-muted-foreground">Mentions and direct messages</p>
          </div>
          <Switch id="sf-notify" checked={notify} onCheckedChange={setNotify} />
        </div>
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <div>
            <label htmlFor="sf-digest" className="block text-sm font-medium">
              Weekly digest
            </label>
            <p className="text-xs text-muted-foreground">One summary every Monday</p>
          </div>
          <Switch id="sf-digest" checked={digest} onCheckedChange={setDigest} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit">Save settings</Button>
        <p className="text-xs text-muted-foreground">Try submitting — the email is invalid.</p>
      </div>
    </form>
  );
}
