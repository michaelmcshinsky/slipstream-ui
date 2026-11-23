import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth-form';


export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to manage your Slipstream UI license, team and billing.',
};
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  return <AuthForm mode="login" next={next} />;
}
