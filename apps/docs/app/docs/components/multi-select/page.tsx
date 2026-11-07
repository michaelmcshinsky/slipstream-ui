import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'MultiSelect',
  description: 'Searchable multi-select filter with visible removable chips and a checkbox panel.',
};

export default function Page() {
  return <Demo />;
}
