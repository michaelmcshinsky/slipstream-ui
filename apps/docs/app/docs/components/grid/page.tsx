import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/grid', {
  title: 'Grid / GridItem',
  description:
    'Typed CSS grid with column counts per breakpoint, auto-fit min-column mode, and GridItem spans.',
});

export default function Page() {
  return <Demo />;
}
