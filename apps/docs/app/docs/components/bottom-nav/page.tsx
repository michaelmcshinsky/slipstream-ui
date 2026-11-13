import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/bottom-nav', {
  title: 'BottomNav',
  description:
    'Mobile bottom tab bar for the 3-5 primary destinations of an app shell, with an active tab, count badges and safe-area padding.',
});

export default function Page() {
  return <Demo />;
}
