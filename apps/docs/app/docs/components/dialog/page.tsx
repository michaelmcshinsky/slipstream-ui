import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/dialog', {
  title: "Dialog",
  description: "Accessible modal dialog with focus trapping, escape-to-close and focus restoration.",
});

export default function Page() {
  return <Demo />;
}
