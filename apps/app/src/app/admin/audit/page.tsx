'use client';

import { useEffect, useState } from 'react';
import { Card, inputClass } from '@/components/ui';

interface AuditRow {
  id: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  createdAt: string;
  actor?: { email?: string | null };
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditRow[]>([]);
  const [action, setAction] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function load(filter = '') {
    const response = await fetch(`/api/admin/audit?action=${encodeURIComponent(filter)}`);
    if (!response.ok) {
      setError('Admin access required.');
      return;
    }
    setLogs((await response.json()).logs ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Audit log</h1>
        <input
          value={action}
          onChange={(event) => {
            setAction(event.target.value);
            load(event.target.value);
          }}
          placeholder="Filter by action…"
          className={`${inputClass} max-w-56`}
          aria-label="Filter by action"
        />
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Card>
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="py-2 font-medium">When</th>
              <th className="py-2 font-medium">Actor</th>
              <th className="py-2 font-medium">Action</th>
              <th className="py-2 font-medium">Target</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-border/60">
                <td className="whitespace-nowrap py-2">{new Date(log.createdAt).toLocaleString()}</td>
                <td className="py-2">{log.actor?.email ?? 'system'}</td>
                <td className="py-2"><code className="rounded bg-muted px-1 text-xs">{log.action}</code></td>
                <td className="py-2 text-xs text-muted-foreground">
                  {log.targetType ? `${log.targetType}:${(log.targetId ?? '').slice(0, 12)}` : '—'}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan={4} className="py-4 text-muted-foreground">No audit entries.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  );
}
