import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/heading', {
  title: 'Heading',
  description:
    'Semantic heading (h1-h6) with a safe default scale and an optional visual-size override.',
});

export default function Page() {
  return <Demo />;
}
