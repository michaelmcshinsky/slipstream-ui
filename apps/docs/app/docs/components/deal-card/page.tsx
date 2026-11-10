import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/deal-card', {
  title: 'DealCard',
  description: 'Deal opportunity card with sector, status, metrics, NDA/CIM badges and access actions.',
});

export default function Page() {
  return <Demo />;
}
