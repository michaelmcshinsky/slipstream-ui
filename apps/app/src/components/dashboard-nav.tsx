'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LocaleSwitcher, useI18n } from '@slipstream-ui/i18n/react';
import { ThemeToggle } from './theme-toggle';

const LINKS = [
  { href: '/dashboard', labelKey: 'shell.dashboard' },
  { href: '/dashboard/billing', labelKey: 'shell.billing' },
  { href: '/dashboard/licenses', labelKey: 'shell.licenses' },
  { href: '/dashboard/team', labelKey: 'shell.team' },
  { href: '/dashboard/settings', labelKey: 'shell.settings' },
] as const;

export function DashboardNav({ isAdmin }: { isAdmin?: boolean }) {
  const { t } = useI18n();
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
              {t(link.labelKey)}
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
      <div className="flex items-center gap-2">
        <LocaleSwitcher className="flex items-center" />
        <ThemeToggle />
        <button
          type="button"
          onClick={signOut}
          className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          {t('shell.signOut')}
        </button>
      </div>
    </div>
  );
}
