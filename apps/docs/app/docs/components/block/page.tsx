import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/block', {
  title: 'Block',
  description:
    'Semantic container (div by default, swappable element) — the structural counterpart to Text (p).',
});

export default function Page() {
  return <Demo />;
}
