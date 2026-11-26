'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardTitle, inputClass } from '@/components/ui';
import { extractData, extractErrorMessage } from '@/lib/api/envelope';

type License = {
  id: string;
  key: string;
  plan: string;
  status: string;
  maxActivations: number;
  activations: { id: string; machineId: string; lastSeenAt: string }[];
};

type ApiKeyRow = {
  id: string;
  name: string;
  prefix: string;
};

type TeamRef = {
  id: string;
  name: string;
  role?: string;
};

type TeamDetail = {
  subscription?: { plan?: string; status?: string } | null;
};

const LICENSE_PLANS = ['PRO', 'TEAM', 'ENTERPRISE'] as const;
type LicensePlan = (typeof LICENSE_PLANS)[number];

function isLicensePlan(value: string | undefined): value is LicensePlan {
  return !!value && (LICENSE_PLANS as readonly string[]).includes(value);
}

export default function LicensesPage() {
  const [licenses, setLicenses] = useState<License[]>([]);
  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [teams, setTeams] = useState<TeamRef[]>([]);
  const [teamId, setTeamId] = useState('');
  const [plan, setPlan] = useState<LicensePlan>('PRO');
  const [note, setNote] = useState('');
  const [newKey, setNewKey] = useState<string | null>(null);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    const [licenseResponse, keyResponse, teamResponse] = await Promise.all([
      fetch('/api/licenses').then((r) => r.json().catch(() => null)),
      fetch('/api/api-keys').then((r) => r.json().catch(() => null)),
      fetch('/api/teams').then((r) => r.json().catch(() => null)),
    ]);
    setLicenses(extractData<{ licenses: License[] }>(licenseResponse)?.licenses ?? []);
    setKeys(extractData<{ keys: ApiKeyRow[] }>(keyResponse)?.keys ?? []);
    const teamList = extractData<{ teams?: TeamRef[] }>(teamResponse)?.teams ?? [];
    setTeams(teamList);
    setTeamId((current) => (current && teamList.some((team) => team.id === current) ? current : teamList[0]?.id ?? ''));
  }

  useEffect(() => {
    void load().finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!teamId) {
      setPlan('PRO');
      return;
    }
    fetch(`/api/teams/${teamId}`)
      .then((r) => r.json())
      .then((data: unknown) => {
        const subscriptionPlan = extractData<{ team?: TeamDetail }>(data)?.team?.subscription?.plan;
        setPlan(isLicensePlan(subscriptionPlan) ? subscriptionPlan : 'PRO');
      })
      .catch(() => setPlan('PRO'));
  }, [teamId]);

  async function createLicense() {
    setError(null);
    if (!teamId) {
      setError('Select a team before issuing a license.');
      return;
    }
    const response = await fetch('/api/licenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId, plan, note: note.trim() || 'Issued from dashboard' }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(extractErrorMessage(data));
      return;
    }
    await load();
  }

  async function revoke(id: string) {
    if (!window.confirm('Revoke this license? Activated machines will lose access immediately.')) return;
    await fetch(`/api/licenses/${id}`, { method: 'DELETE' });
    await load();
  }

  async function deactivateMachine(licenseId: string, machineId: string) {
    if (!window.confirm(`Remove machine ${machineId.slice(0, 8)}… from this license?`)) return;
    await fetch(`/api/licenses/${licenseId}/activations/${encodeURIComponent(machineId)}`, { method: 'DELETE' });
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
      setError(extractErrorMessage(data));
      return;
    }
    // Envelope wraps the plaintext key: { data: { key } } — read it before it
    // is lost, since it is shown exactly once.
    const plaintext = extractData<{ key?: string }>(data)?.key;
    if (!plaintext) {
      setError('Key created but the plaintext was not returned by the server.');
      return;
    }
    setNewKey(plaintext);
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
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <CardTitle>License keys</CardTitle>
          <div className="flex flex-wrap items-center gap-2">
            <select
              aria-label="Team"
              value={teamId}
              onChange={(event) => setTeamId(event.target.value)}
              className={inputClass}
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            <select
              aria-label="Plan"
              value={plan}
              onChange={(event) => {
                const value = event.target.value;
                if (isLicensePlan(value)) setPlan(value);
              }}
              className={inputClass}
            >
              {LICENSE_PLANS.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            <input
              type="text"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Note (optional)"
              aria-label="License note"
              className={`${inputClass} w-40`}
            />
            <button
              type="button"
              onClick={createLicense}
              disabled={!teamId}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              New license
            </button>
          </div>
        </div>
        {error && <p role="alert" className="mb-3 text-sm text-destructive">{error}</p>}
        {loading && <p className="mb-3 text-sm text-muted-foreground">Loading…</p>}
        <div className="space-y-4">
          {licenses.map((license) => (
            <div key={license.id} className="rounded-lg border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <code className="rounded bg-muted px-2 py-1 font-mono text-xs">
                  {revealedKeys[license.id] ?? license.key}
                </code>
                <button
                  type="button"
                  className="text-xs text-muted-foreground hover:underline"
                  onClick={async () => {
                    if (revealedKeys[license.id]) {
                      setRevealedKeys((prev) => {
                        const next = { ...prev };
                        delete next[license.id];
                        return next;
                      });
                      return;
                    }
                    const response = await fetch(`/api/licenses/${license.id}`).then((r) => r.json().catch(() => null));
                    const key = extractData<{ key?: string }>(response)?.key;
                    if (key) setRevealedKeys((prev) => ({ ...prev, [license.id]: key }));
                  }}
                >
                  {revealedKeys[license.id] ? 'Hide' : 'Reveal'}
                </button>
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
              </p>
              {license.activations.length > 0 && (
                <ul className="mt-1 space-y-1">
                  {license.activations.map((activation) => (
                    <li key={activation.id} className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">{activation.machineId}</span>
                      <span className="flex items-center gap-2">
                        <span>seen {new Date(activation.lastSeenAt).toLocaleDateString()}</span>
                        <button
                          type="button"
                          onClick={() => deactivateMachine(license.id, activation.machineId)}
                          className="text-destructive hover:underline"
                        >
                          Remove
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          {licenses.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No licenses yet —{' '}
              <Link href="/dashboard/billing" className="font-medium text-primary hover:underline">
                upgrade to a paid plan
              </Link>{' '}
              to get one.
            </p>
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
                  if (!window.confirm(`Revoke API key "${key.name}"?`)) return;
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
