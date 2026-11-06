import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { prisma } from '@slipstream-ui/db';
import { getMessages, resolveLocale, translate } from '@slipstream-ui/i18n';
import { LocaleSwitcher } from '@slipstream-ui/i18n/react';
import { getSessionUser } from '@/lib/session';
import { DashboardNav } from '@/components/dashboard-nav';
import { ImpersonationBanner } from '@/components/impersonation-banner';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect('/login?next=/dashboard');

  const impersonating = (await cookies()).has('slipstream_impersonator');
  const locale = resolveLocale((await cookies()).get('slipstream-locale')?.value);
  const messages = getMessages(locale);

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.suspendedAt) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-sm rounded-xl border border-destructive/40 bg-card p-6 text-center">
          <h1 className="text-lg font-semibold">{translate(messages, 'shell.accountSuspended')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {translate(messages, 'shell.accountSuspendedDescription')}
          </p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen">
      {impersonating && <ImpersonationBanner />}
      <header className="border-b border-border bg-background px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <a href="/" className="text-lg font-bold tracking-tight">
            Slipstream<span className="text-primary">UI</span>
          </a>
          <span className="text-sm text-muted-foreground">{user.email}</span>
          <LocaleSwitcher className="flex items-center" />
        </div>
      </header>
      <DashboardNav isAdmin={user.role === 'ADMIN'} />
      <main className="container mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
