import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/sources', {
  title: "Sources",
  description: "Show citations and references alongside an AI response. Sources renders a numbered list; Source renders a single citation for custom layouts.",
});

export default function Page() {
  return <Demo />;
}
