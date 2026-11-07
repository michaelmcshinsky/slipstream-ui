import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'ComparisonTable',
  description: 'Marketing comparison table with check/dash boolean cells, a highlighted column and responsive overflow.',
};

export default function Page() {
  return <Demo />;
}
