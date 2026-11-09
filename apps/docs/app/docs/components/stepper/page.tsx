import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Stepper',
  description:
    'Multi-step flow indicator with horizontal, labels-below, vertical, and compact dots layouts, aria-current state, and centered titles when no description is present.',
};

export default function Page() {
  return <Demo />;
}
