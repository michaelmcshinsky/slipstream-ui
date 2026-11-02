import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'FormField',
  description:
    'Label + control + hint/error in one unit with htmlFor, aria-describedby, and aria-invalid wiring applied automatically.',
};

export default function Page() {
  return <Demo />;
}
