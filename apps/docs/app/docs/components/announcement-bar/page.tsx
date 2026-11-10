import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/announcement-bar', {
  title: 'AnnouncementBar',
  description: 'Dismissible announcement bar with optional action, tone and sticky positioning.',
});

export default function Page() {
  return <Demo />;
}
