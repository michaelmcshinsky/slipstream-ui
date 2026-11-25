'use client';

import { useEffect, useState } from 'react';
import { Card, inputClass } from '@/components/ui';
import { extractData, extractErrorMessage } from '@/lib/api/envelope';

type AuditRow = {
  id: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  createdAt: string;
  actor?: { email?: string | null };
};

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditRow[]>([]);
  const [action, setAction] = useState('');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(filter = '', cursor?: string) {
    setError(null);
    if (cursor) setLoadingMore(true);
    try {
      const params = new URLSearchParams({ action: filter });
      if (cursor) params.set('cursor', cursor);
      const response = await fetch(`/api/admin/audit?${params.toString()}`);
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setError(extractErrorMessage(data, 'Admin access required.'));
        return;
      }
      const page = extractData<{ logs?: AuditRow[]; nextCursor?: string }>(data);
      setLogs((prev) => (cursor ? [...prev, ...(page?.logs ?? [])] : (page?.logs ?? [])));
      setNextCursor(page?.nextCursor ?? null);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  }

  // Debounce the action filter: one request per pause, not per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      void load(action);
    }, action ? 300 : 0);
    return () => clearTimeout(timer);
  }, [action]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Audit log</h1>
        <input
          value={action}
          onChange={(event) => setAction(event.target.value)}
          placeholder="Filter by action…"
          className={`${inputClass} max-w-56`}
          aria-label="Filter by action"
        />
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
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
        {nextCursor && (
          <div className="border-t border-border p-3 text-center">
            <button
              type="button"
              disabled={loadingMore}
              onClick={() => load(action, nextCursor)}
              className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted disabled:opacity-50"
            >
              {loadingMore ? 'Loading…' : 'Load more'}
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
