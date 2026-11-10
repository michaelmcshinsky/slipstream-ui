import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/popover', {
  title: "Popover",
  description: "Floating panel anchored to a trigger with interactive content.",
});

export default function Page() {
  return <Demo />;
}
