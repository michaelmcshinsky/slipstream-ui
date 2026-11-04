import type { Metadata } from 'next';
import { AuthForm } from '@/components/auth-form';


export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Request a password reset link for your Slipstream UI account.',
};
export default function ForgotPasswordPage() {
  return <AuthForm mode="forgot" />;
}
