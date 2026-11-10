import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/timeline', {
  title: 'Timeline',
  description: 'Vertical chronology for experience, activity and audit trails.',
});

export default function Page() {
  return <Demo />;
}
