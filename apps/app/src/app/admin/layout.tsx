import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import Link from 'next/link';

/** Super-admin chrome: every child page is additionally guarded per-route. */
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/login?next=/admin');
  if (user.role !== 'ADMIN') redirect('/dashboard');

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-foreground text-background px-4 py-3">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="font-bold tracking-tight">Slipstream Admin</span>
            <nav className="flex gap-1">
              {[
                ['Overview', '/admin'],
                ['Users', '/admin/users'],
                ['Payments', '/admin/payments'],
                ['Licenses', '/admin/licenses'],
                ['Audit log', '/admin/audit'],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="rounded-md px-2.5 py-1 text-sm opacity-80 transition-opacity hover:opacity-100"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/dashboard" className="opacity-80 hover:opacity-100">← Dashboard</Link>
            <span>{user.email}</span>
          </div>
        </div>
      </header>
      <main className="container mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
