import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/container', {
  title: 'Container',
  description: 'Centered, width-constrained page container with shared gutters and four width presets.',
});

export default function Page() {
  return <Demo />;
}
