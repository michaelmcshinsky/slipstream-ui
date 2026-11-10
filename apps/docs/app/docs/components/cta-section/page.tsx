import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/cta-section', {
  title: 'CTASection',
  description: 'Full-width conversion band with eyebrow, headline, supporting copy and actions.',
});

export default function Page() {
  return <Demo />;
}
