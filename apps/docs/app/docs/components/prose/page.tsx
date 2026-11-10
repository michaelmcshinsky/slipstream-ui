import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/prose', {
  title: 'Prose',
  description: 'Self-contained long-form typography for rendered markdown/MDX.',
});

export default function Page() {
  return <Demo />;
}
