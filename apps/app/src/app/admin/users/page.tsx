'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui';


interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  suspendedAt: string | null;
  createdAt: string;
  _count: { memberships: number; licenseKeys: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function load(q = '') {
    const response = await fetch(`/api/admin/users?q=${encodeURIComponent(q)}`);
    if (response.status === 403) {
      setError('Admin access required.');
      return;
    }
    setUsers((await response.json()).users ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function patchUser(id: string, data: Record<string, unknown>) {
    const response = await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      setError((await response.json()).error);
      return;
    }
    await load();
  }

  async function impersonate(id: string) {
    await fetch(`/api/admin/users/${id}/impersonate`, { method: 'POST' });
    window.location.href = '/dashboard';
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            load(event.target.value);
          }}
          placeholder="Search email or name…"
          className="w-64 rounded-md border border-input bg-background px-3 py-2 text-sm"
          aria-label="Search users"
        />
      </div>

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}

      <Card>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="py-2 font-medium">User</th>
              <th className="py-2 font-medium">Teams</th>
              <th className="py-2 font-medium">Licenses</th>
              <th className="py-2 font-medium">Role</th>
              <th className="py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={`border-b border-border/60 ${user.suspendedAt ? 'opacity-50' : ''}`}>
                <td className="py-2">
                  <div>{user.email}</div>
                  <div className="text-xs text-muted-foreground">{user.name ?? '—'}</div>
                </td>
                <td className="py-2">{user._count.memberships}</td>
                <td className="py-2">{user._count.licenseKeys}</td>
                <td className="py-2">
                  <select
                    value={user.role}
                    onChange={(event) => patchUser(user.id, { role: event.target.value })}
                    aria-label={`Role for ${user.email}`}
                    disabled={user.suspendedAt !== null}
                    className="rounded border border-border bg-background px-1.5 py-1 text-xs"
                  >
                    <option>USER</option>
                    <option>ADMIN</option>
                  </select>
                </td>
                <td className="py-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => impersonate(user.id)}
                      className="text-xs text-primary hover:underline"
                    >
                      Impersonate
                    </button>
                    {user.suspendedAt ? (
                      <button
                        type="button"
                        onClick={() => patchUser(user.id, { suspended: false })}
                        className="text-xs hover:underline"
                      >
                        Unsuspend
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => patchUser(user.id, { suspended: true })}
                        className="text-xs text-destructive hover:underline"
                      >
                        Suspend
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} className="py-4 text-muted-foreground">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
