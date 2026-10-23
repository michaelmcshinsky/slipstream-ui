'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const LINKS = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/billing', label: 'Billing' },
  { href: '/dashboard/licenses', label: 'Licenses & Keys' },
  { href: '/dashboard/team', label: 'Team' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export function DashboardNav({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card px-4 py-3">
      <nav className="flex flex-wrap gap-1">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? 'page' : undefined}
              className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                active ? 'bg-muted font-medium' : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/admin"
            className="rounded-md px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10"
          >
            Super Admin →
          </Link>
        )}
      </nav>
      <button
        type="button"
        onClick={signOut}
        className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        Sign out
      </button>
    </div>
  );
}
