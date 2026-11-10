import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/logo-cloud', {
  title: 'LogoCloud',
  description: 'Trust strip for member, customer or partner logos with captions, columns and optional links.',
});

export default function Page() {
  return <Demo />;
}
