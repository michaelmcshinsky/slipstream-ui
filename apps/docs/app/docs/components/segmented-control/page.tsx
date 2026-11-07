import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'SegmentedControl',
  description: 'Single- or multi-select segmented control for view and filter switches.',
};

export default function Page() {
  return <Demo />;
}
