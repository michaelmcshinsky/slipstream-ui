import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/accordion', {
  title: "Accordion",
  description: "Collapsible content sections with ARIA accordion semantics.",
});

export default function Page() {
  return <Demo />;
}
