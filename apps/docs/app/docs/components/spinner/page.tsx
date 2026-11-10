import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/spinner', {
  title: "Spinner",
  description: "Indeterminate loading indicator with accessible status semantics.",
});

export default function Page() {
  return <Demo />;
}
