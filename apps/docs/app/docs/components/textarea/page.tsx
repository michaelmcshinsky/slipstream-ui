import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/textarea', {
  title: "Textarea",
  description: "Multi-line text input styled to match Input.",
});

export default function Page() {
  return <Demo />;
}
