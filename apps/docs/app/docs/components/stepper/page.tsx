import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Stepper',
  description: 'Multi-step flow indicator: ordered list, aria-current step, text state for complete/current/upcoming.',
};

export default function Page() {
  return <Demo />;
}
