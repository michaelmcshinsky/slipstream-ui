import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/metric-card', {
  title: 'MetricCard',
  description:
    'KPI tile with label, value, directional delta (arrow + color) and supporting hint.',
});

export default function Page() {
  return <Demo />;
}
