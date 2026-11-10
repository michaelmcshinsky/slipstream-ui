import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/branch', {
  title: "Branch",
  description: "Variant navigation for branched messages: ‹ N / M › controls that let users compare alternative AI responses. Purely presentational — you swap the content.",
});

export default function Page() {
  return <Demo />;
}
