import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Fieldset',
  description:
    'Groups related form controls in a native fieldset with a legend, optional description, and an error slot.',
};

export default function Page() {
  return <Demo />;
}
