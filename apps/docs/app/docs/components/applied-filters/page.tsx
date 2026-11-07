import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'AppliedFilters',
  description: 'Applied-filter summary with a live count, removable chips and an edit action.',
};

export default function Page() {
  return <Demo />;
}
