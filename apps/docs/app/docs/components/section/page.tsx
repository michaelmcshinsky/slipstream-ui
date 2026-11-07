import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Section',
  description: 'Full-width page section with a surface tone, vertical rhythm and an optional centered container.',
};

export default function Page() {
  return <Demo />;
}
