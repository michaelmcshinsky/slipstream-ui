import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/process-steps', {
  title: 'ProcessSteps',
  description: 'Ordered process cards with derived step numbers or custom icons.',
});

export default function Page() {
  return <Demo />;
}
