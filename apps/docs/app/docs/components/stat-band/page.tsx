import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'StatBand',
  description: 'Semantic description list of headline stats with labels, optional hints and column presets.',
};

export default function Page() {
  return <Demo />;
}
