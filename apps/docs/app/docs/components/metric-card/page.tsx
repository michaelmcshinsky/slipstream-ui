import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'MetricCard',
  description:
    'KPI tile with label, value, directional delta (arrow + color) and supporting hint.',
};

export default function Page() {
  return <Demo />;
}
