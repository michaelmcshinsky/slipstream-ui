import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/auth-layout', {
  title: 'AuthLayout',
  description:
    'Centered authentication surface with brand, title/description, form card and footer.',
});

export default function Page() {
  return <Demo />;
}
