import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/site-footer', {
  title: 'SiteFooter',
  description: 'Marketing footer with brand, link columns and a legal bar.',
});

export default function Page() {
  return <Demo />;
}
