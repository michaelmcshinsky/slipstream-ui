import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/site-header', {
  title: 'SiteHeader',
  description: 'Sticky marketing header with prefix-aware nav, actions and a mobile drawer.',
});

export default function Page() {
  return <Demo />;
}
