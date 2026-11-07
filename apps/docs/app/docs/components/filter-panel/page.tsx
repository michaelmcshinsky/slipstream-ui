import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'FilterPanel',
  description: 'Structured filter panel with collapsible sections and reset/apply actions.',
};

export default function Page() {
  return <Demo />;
}
