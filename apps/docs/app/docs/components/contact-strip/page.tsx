import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/contact-strip', {
  title: 'ContactStrip',
  description: 'Compact labelled contact rows with optional icons and links.',
});

export default function Page() {
  return <Demo />;
}
