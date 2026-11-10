import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/badge', {
  title: "Badge",
  description: "A small status indicator component for displaying tags, counts, or status information.",
});

export default function Page() {
  return <Demo />;
}
