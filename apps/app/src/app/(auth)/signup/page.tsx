import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth-form';


export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create your Slipstream UI account and start a 14-day trial.',
};
export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
