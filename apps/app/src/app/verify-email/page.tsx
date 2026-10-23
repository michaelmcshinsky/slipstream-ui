import { Suspense } from 'react';
import { VerifyEmailForm } from '@/components/verify-email-form';

export const metadata = { title: 'Verify your email' };

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Suspense>
        <VerifyEmailForm />
      </Suspense>
    </main>
  );
}
