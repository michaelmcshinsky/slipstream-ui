import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/table', {
  title: "Table",
  description: "Semantic data table with headers, body, footer, and accessible caption.",
});

export default function Page() {
  return <Demo />;
}
