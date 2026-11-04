import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Search',
  description:
    'Select-with-search: type to filter a full-width dropdown of options, or arrow through the full set from an empty query.',
};

export default function Page() {
  return <Demo />;
}
