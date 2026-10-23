'use client';

import { useEffect, useState } from 'react';
import { Card, CardTitle } from '@/components/ui';
import { extractData, extractErrorMessage } from '@/lib/api/envelope';

interface Payment {
  id: string;
  teamId: string;
  amountCents: number;
  status: string;
  description: string;
  createdAt: string;
  team?: { name?: string } | null;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const response = await fetch('/api/admin/payments');
    if (!response.ok) {
      setError('Admin access required.');
      return;
    }
    setPayments(extractData<{ payments: Payment[] }>(await response.json())?.payments ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function refund(id: string) {
    const response = await fetch(`/api/admin/payments/${id}/refund`, { method: 'POST' });
    if (!response.ok) {
      setError(extractErrorMessage(await response.json()));
      return;
    }
    await load();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Card>
        <CardTitle>All payments</CardTitle>
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="py-2 font-medium">Date</th>
              <th className="py-2 font-medium">Team</th>
              <th className="py-2 font-medium">Description</th>
              <th className="py-2 font-medium">Amount</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="border-b border-border/60">
                <td className="py-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
                <td className="py-2">{payment.team?.name ?? payment.teamId.slice(0, 8)}</td>
                <td className="py-2">{payment.description}</td>
                <td className="py-2">${(payment.amountCents / 100).toFixed(2)}</td>
                <td className={`py-2 ${payment.status === 'REFUNDED' ? 'text-muted-foreground line-through' : ''}`}>
                  {payment.status}
                </td>
                <td className="py-2">
                  {payment.status === 'PAID' ? (
                    <button
                      type="button"
                      onClick={() => refund(payment.id)}
                      className="text-xs text-destructive hover:underline"
                    >
                      Refund
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr><td colSpan={6} className="py-4 text-muted-foreground">No payments yet.</td></tr>
            )}
          </tbody>
        </table>
        </div>
      </Card>
    </div>
  );
}
