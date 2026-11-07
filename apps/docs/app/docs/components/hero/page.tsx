import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Hero',
  description: 'Marketing hero with badge, eyebrow, headline, copy, actions and an optional media slot.',
};

export default function Page() {
  return <Demo />;
}
