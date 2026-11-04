import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth-form';


export const metadata: Metadata = {
  title: 'Reset password',
  description: 'Choose a new password for your Slipstream UI account.',
};
export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <AuthForm mode="reset" token={token} />;
}
