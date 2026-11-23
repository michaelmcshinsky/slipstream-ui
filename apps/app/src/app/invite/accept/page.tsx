import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/session';
import { InviteAcceptForm } from '@/components/invite-accept-form';

export const metadata: Metadata = {
  title: 'Accept invite',
  robots: { index: false, follow: false },
};
export const dynamic = 'force-dynamic';

export default async function InviteAcceptPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const user = await getSessionUser();
  const next = `/invite/accept${token ? `?token=${encodeURIComponent(token)}` : ''}`;
  if (!user) redirect(`/login?next=${encodeURIComponent(next)}`);

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <InviteAcceptForm token={token ?? ''} />
    </main>
  );
}
