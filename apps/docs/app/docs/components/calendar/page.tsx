import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/calendar', {
  title: 'Calendar',
  description: 'Month grid with ISO date keys, min/max bounds and full keyboard navigation.',
});

export default function Page() {
  return <Demo />;
}
