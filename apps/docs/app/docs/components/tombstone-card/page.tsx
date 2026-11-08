import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'TombstoneCard',
  description: 'Placeholder card for archived, closed or unavailable marketplace items.',
};

export default function Page() {
  return <Demo />;
}
