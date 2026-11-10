import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/feature-grid', {
  title: 'FeatureGrid',
  description: 'Grid of feature or benefit cards with an icon, title, copy and optional link.',
});

export default function Page() {
  return <Demo />;
}
