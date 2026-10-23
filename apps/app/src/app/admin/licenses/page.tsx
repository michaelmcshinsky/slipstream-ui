'use client';

import { useEffect, useState } from 'react';
import { Card, CardTitle, inputClass } from '@/components/ui';
import { extractData, extractErrorMessage } from '@/lib/api/envelope';

interface LicenseRow {
  id: string;
  key: string;
  plan: string;
  status: string;
  maxActivations: number;
  activations: { id: string; machineId: string }[];
  owner?: { email?: string };
}

export default function AdminLicensesPage() {
  const [licenses, setLicenses] = useState<LicenseRow[]>([]);
  const [issuedKey, setIssuedKey] = useState<string | null>(null);
  const [userId, setUserId] = useState('');
  const [plan, setPlan] = useState('PRO');
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const response = await fetch('/api/admin/licenses');
    if (!response.ok) {
      setError('Admin access required.');
      return;
    }
    setLicenses(extractData<{ licenses: LicenseRow[] }>(await response.json())?.licenses ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function issue(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const response = await fetch('/api/admin/licenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, plan }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(extractErrorMessage(data));
      return;
    }
    // Envelope wraps the plaintext comp key: { data: { key } } (KC-018 pattern).
    setIssuedKey(extractData<{ key?: string }>(data)?.key ?? null);
    await load();
  }

  async function revoke(id: string) {
    const response = await fetch('/api/admin/licenses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseId: id }),
    });
    if (!response.ok) {
      setError(extractErrorMessage(await response.json()));
      return;
    }
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">License keys</h1>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <Card>
        <CardTitle>Issue comp license</CardTitle>
        {issuedKey && (
          <p role="status" className="mb-3 break-all rounded-lg bg-primary/10 p-3 font-mono text-xs">{issuedKey}</p>
        )}
        <form onSubmit={issue} className="flex flex-wrap items-end gap-2">
          <input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            required
            placeholder="Owner user id (from Users page)"
            className={`${inputClass} max-w-xs`}
          />
          <select value={plan} onChange={(event) => setPlan(event.target.value)} aria-label="Plan" className={inputClass + ' max-w-36'}>
            {['PRO', 'TEAM', 'ENTERPRISE'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <button type="submit" className="whitespace-nowrap rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Issue license
          </button>
        </form>
      </Card>

      <Card>
        <CardTitle>All licenses</CardTitle>
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="py-2 font-medium">Owner</th>
              <th className="py-2 font-medium">Plan</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 font-medium">Activations</th>
            </tr>
          </thead>
          <tbody>
            {licenses.map((license) => (
              <tr key={license.id} className="border-b border-border/60">
                <td className="py-2">{license.owner?.email ?? '—'}</td>
                <td className="py-2">{license.plan}</td>
                <td className="py-2"><span className={license.status === 'ACTIVE' ? 'text-green-600' : 'text-muted-foreground'}>{license.status}</span>
                  {license.status === 'ACTIVE' && (<button type="button" onClick={() => revoke(license.id)} className="ml-2 text-xs text-destructive hover:underline">Revoke</button>)}</td>
                <td className="py-2">
                  {license.activations.length} / {license.maxActivations}
                </td>
              </tr>
            ))}
            {licenses.length === 0 && (
              <tr><td colSpan={4} className="py-4 text-muted-foreground">No licenses.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  );
}
