import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/entity-card', {
  title: 'EntityCard',
  description: 'Firm or member profile card with logo, type, location, stats, tags and actions.',
});

export default function Page() {
  return <Demo />;
}
