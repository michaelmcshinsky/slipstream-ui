'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, inputClass } from '@/components/ui';
import { extractData, extractErrorMessage } from '@/lib/api/envelope';

type Delivery = {
  id: string;
  toEmail: string;
  kind: string;
  subject: string;
  status: 'QUEUED' | 'SENT' | 'FAILED';
  attempts: number;
  lastError: string | null;
  createdAt: string;
};

const STATUS_FILTERS = ['ALL', 'FAILED', 'QUEUED', 'SENT'] as const;

export default function AdminEmailPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [status, setStatus] = useState<(typeof STATUS_FILTERS)[number]>('ALL');
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (filter: string, cursor?: string) => {
    setError(null);
    if (cursor) setLoadingMore(true);
    try {
      const params = new URLSearchParams();
      if (filter !== 'ALL') params.set('status', filter);
      if (cursor) params.set('cursor', cursor);
      const response = await fetch(`/api/admin/email/deliveries?${params.toString()}`);
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setError(extractErrorMessage(data, 'Admin access required.'));
        return;
      }
      const page = extractData<{ deliveries?: Delivery[]; nextCursor?: string }>(data);
      setDeliveries((prev) => (cursor ? [...prev, ...(page?.deliveries ?? [])] : (page?.deliveries ?? [])));
      setNextCursor(page?.nextCursor ?? null);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => void load(status), status === 'ALL' ? 0 : 300);
    return () => clearTimeout(timer);
  }, [status, load]);

  async function retryFailed() {
    setRetrying(true);
    setNotice(null);
    setError(null);
    try {
      const response = await fetch('/api/admin/email/deliveries/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data: unknown = await response.json().catch(() => null);
      if (!response.ok) {
        setError(extractErrorMessage(data, 'Retry failed.'));
        return;
      }
      const result = extractData<{ resent?: number }>(data);
      setNotice(`Retried ${result?.resent ?? 0} failed deliveries.`);
      void load(status);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setRetrying(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Email deliveries</h1>
        <div className="flex items-center gap-2">
          <select
            aria-label="Filter by status"
            className={inputClass}
            value={status}
            onChange={(event) => setStatus(event.target.value as (typeof STATUS_FILTERS)[number])}
          >
            {STATUS_FILTERS.map((value) => (
              <option key={value} value={value}>
                {value === 'ALL' ? 'All statuses' : value}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void retryFailed()}
            disabled={retrying}
            className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {retrying ? 'Retrying…' : 'Retry failed'}
          </button>
        </div>
      </div>

      {notice && <p className="text-sm text-success">{notice}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-2 font-medium">To</th>
              <th className="px-4 py-2 font-medium">Kind</th>
              <th className="px-4 py-2 font-medium">Subject</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Attempts</th>
              <th className="px-4 py-2 font-medium">Last error</th>
              <th className="px-4 py-2 font-medium">Sent at</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.id} className="border-b border-border last:border-0">
                <td className="px-4 py-2">{delivery.toEmail}</td>
                <td className="px-4 py-2">{delivery.kind}</td>
                <td className="max-w-[16rem] truncate px-4 py-2" title={delivery.subject}>
                  {delivery.subject}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={
                      delivery.status === 'FAILED'
                        ? 'text-destructive'
                        : delivery.status === 'SENT'
                          ? 'text-success'
                          : 'text-warning-ink'
                    }
                  >
                    {delivery.status}
                  </span>
                </td>
                <td className="px-4 py-2">{delivery.attempts}</td>
                <td className="max-w-[14rem] truncate px-4 py-2 text-muted-foreground" title={delivery.lastError ?? ''}>
                  {delivery.lastError ?? '—'}
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  {new Date(delivery.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {!loading && deliveries.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No deliveries found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {nextCursor && (
        <button
          type="button"
          disabled={loadingMore}
          onClick={() => void load(status, nextCursor)}
          className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
        >
          {loadingMore ? 'Loading…' : 'Load more'}
        </button>
      )}
    </div>
  );
}
