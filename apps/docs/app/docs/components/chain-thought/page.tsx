import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/chain-thought', {
  title: "ChainThought",
  description: "Show ordered agent work with explicit progress status.",
});

export default function Page() {
  return <Demo />;
}
