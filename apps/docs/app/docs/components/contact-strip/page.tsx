import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'ContactStrip',
  description: 'Compact labelled contact rows with optional icons and links.',
};

export default function Page() {
  return <Demo />;
}
