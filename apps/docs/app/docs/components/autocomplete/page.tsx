import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Autocomplete',
  description:
    'Type-ahead input following the HTML autocomplete model: any value is allowed while matching suggestions appear in a keyboard-navigable listbox.',
};

export default function Page() {
  return <Demo />;
}
