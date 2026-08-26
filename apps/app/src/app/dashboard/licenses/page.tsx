'use client';

import { useEffect, useState } from 'react';
import { Card, CardTitle, inputClass } from '@/components/ui';

interface License {
  id: string;
  key: string;
  plan: string;
  status: string;
  maxActivations: number;
  activations: { id: string; machineId: string; lastSeenAt: string }[];
}

interface ApiKeyRow {
  id: string;
  name: string;
  prefix: string;
}

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const [licenseResponse, keyResponse] = await Promise.all([
      fetch('/api/licenses').then((r) => r.json()),
      fetch('/api/api-keys').then((r) => r.json()),
    ]);
    setLicenses(licenseResponse.licenses ?? []);
    setKeys(keyResponse.keys ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function createLicense() {
    setError(null);
    const response = await fetch('/api/licenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: 'PRO', note: 'Issued from dashboard' }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
      return;
    }
    await load();
  }

  async function revoke(id: string) {
    await fetch(`/api/licenses/${id}`, { method: 'DELETE' });
    await load();
  }

  async function createApiKey(event: React.FormEvent<HTMLFormElement & { reset(): void }>) {
    event.preventDefault();
    setError(null);
    const name = new FormData(event.currentTarget).get('name') as string;
    const response = await fetch('/api/api-keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error);
      return;
    }
    setNewKey(data.key);
    event.currentTarget.reset();
    await load();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Licenses & API keys</h1>
        <p className="mt-1 text-muted-foreground">
          License keys unlock the private registry; API keys authenticate the CLI and MCP server.
        </p>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <CardTitle>License keys</CardTitle>
          <button
            type="button"
            onClick={createLicense}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            New license
          </button>
        </div>
        {error && <p role="alert" className="mb-3 text-sm text-destructive">{error}</p>}
        <div className="space-y-4">
          {licenses.map((license) => (
            <div key={license.id} className="rounded-lg border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <code className="rounded bg-muted px-2 py-1 font-mono text-xs">{license.key}</code>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{license.plan}</span>
                  {license.status === 'ACTIVE' ? (
                    <button
                      type="button"
                      onClick={() => revoke(license.id)}
                      className="text-xs text-destructive hover:underline"
                    >
                      Revoke
                    </button>
                  ) : (
                    <span className="text-xs uppercase text-muted-foreground">{license.status}</span>
                  )}
                </div>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Activations: {license.activations.length} / {license.maxActivations}
                {license.activations.length > 0 && (
                  <> — machines: {license.activations.map((a) => a.machineId.slice(0, 8)).join(', ')}</>
                )}
              </p>
            </div>
          ))}
          {licenses.length === 0 && (
            <p className="text-sm text-muted-foreground">No licenses yet — upgrade to Pro to get one.</p>
          )}
        </div>
      </Card>

      <Card>
        <CardTitle>API keys</CardTitle>
        {newKey && (
          <p role="status" className="mb-4 break-all rounded-lg bg-primary/10 p-3 font-mono text-xs text-foreground">
            {newKey} <span className="block pt-1 text-muted-foreground">Copy it now — it won't be shown again.</span>
          </p>
        )}
        <form onSubmit={createApiKey} className="mb-4 flex gap-2">
          <input name="name" required placeholder="Key name (e.g. CI pipeline)" className={inputClass} />
          <button type="submit" className="whitespace-nowrap rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Create key
          </button>
        </form>
        <ul className="divide-y divide-border">
          {keys.map((key) => (
            <li key={key.id} className="flex items-center justify-between py-2 text-sm">
              <span>{key.name} <span className="ml-2 font-mono text-xs text-muted-foreground">{key.prefix}…</span></span>
              <button
                type="button"
                onClick={async () => {
                  await fetch(`/api/api-keys/${key.id}`, { method: 'DELETE' });
                  await load();
                }}
                className="text-xs text-destructive hover:underline"
              >
                Revoke
              </button>
            </li>
          ))}
          {keys.length === 0 && <li className="py-2 text-sm text-muted-foreground">No API keys.</li>}
        </ul>
      </Card>
    </div>
  );
}
