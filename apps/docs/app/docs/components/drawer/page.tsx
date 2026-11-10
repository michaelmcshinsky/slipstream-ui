import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/drawer', {
  title: 'Drawer',
  description:
    'Edge sheet for secondary flows: slides from any side (sm/md/lg), with Dialog-grade modal semantics (portal, focus trap, Escape, focus restoration).',
});

export default function Page() {
  return <Demo />;
}
