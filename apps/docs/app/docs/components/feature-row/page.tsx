import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'FeatureRow',
  description: 'Alternating media and copy row for mid-page feature sections.',
};

export default function Page() {
  return <Demo />;
}
