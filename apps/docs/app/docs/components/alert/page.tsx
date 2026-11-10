import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/alert', {
  title: "Alert",
  description: "Inline alert for status messages with semantic variants.",
});

export default function Page() {
  return <Demo />;
}
