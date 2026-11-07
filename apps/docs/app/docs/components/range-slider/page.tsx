import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'RangeSlider',
  description: 'Dual-thumb numeric range slider with labeled native inputs and formatted values.',
};

export default function Page() {
  return <Demo />;
}
