import type { Metadata } from 'next';
import { Suspense } from 'react';
import { InviteAcceptForm } from './invite-accept-form';

export const metadata: Metadata = {
  title: 'Accept invitation',
  description: 'Review and accept your Slipstream UI team invitation.',
  robots: { index: false, follow: false },
};

export default function InviteAcceptPage() {
  return (
    <main id="main" className="flex min-h-screen items-center justify-center px-4">
      <Suspense>
        <InviteAcceptForm />
      </Suspense>
    </main>
  );
}
