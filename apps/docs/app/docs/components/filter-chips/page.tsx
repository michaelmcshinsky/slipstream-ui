import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'FilterChips',
  description: 'Active-filter summary with removable chips and a clear-all action.',
};

export default function Page() {
  return <Demo />;
}
