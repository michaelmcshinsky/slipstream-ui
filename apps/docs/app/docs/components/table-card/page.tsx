import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/table-card', {
  title: 'TableCard',
  description: 'Table shell with title, actions, toolbar, edge-to-edge body and footer.',
});

export default function Page() {
  return <Demo />;
}
