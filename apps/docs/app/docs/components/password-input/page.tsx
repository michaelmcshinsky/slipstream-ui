import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/password-input', {
  title: 'PasswordInput',
  description:
    'Password field with an accessible show/hide toggle (aria-pressed), built on Input.',
});

export default function Page() {
  return <Demo />;
}
