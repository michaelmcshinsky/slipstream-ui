import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'FormLayout',
  description:
    'Groups form fields with even, tokenized spacing: vertical stack, horizontal row, or 1-4 column grid, optionally as a semantic fieldset.',
};

export default function Page() {
  return <Demo />;
}
