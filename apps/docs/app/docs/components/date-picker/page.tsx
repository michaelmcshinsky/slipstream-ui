import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'DatePicker',
  description: 'Native date field with an ISO-string contract and an optional clear button.',
};

export default function Page() {
  return <Demo />;
}
