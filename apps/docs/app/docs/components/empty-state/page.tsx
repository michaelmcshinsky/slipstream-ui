import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'EmptyState',
  description:
    'Placeholder for empty collections and zero-result searches: icon, title, description and actions.',
};

export default function Page() {
  return <Demo />;
}
