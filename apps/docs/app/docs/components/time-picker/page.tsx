import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'TimePicker',
  description: 'Native time field with an HH:MM contract and an optional clear button.',
};

export default function Page() {
  return <Demo />;
}
