import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'EntityCard',
  description: 'Firm or member profile card with logo, type, location, stats, tags and actions.',
};

export default function Page() {
  return <Demo />;
}
