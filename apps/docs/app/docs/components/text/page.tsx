import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/text', {
  title: 'Text',
  description:
    'Semantic paragraph text with a controlled type scale; renders a real p (or span with inline).',
});

export default function Page() {
  return <Demo />;
}
