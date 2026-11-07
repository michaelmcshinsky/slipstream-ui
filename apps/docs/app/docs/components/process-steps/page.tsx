import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'ProcessSteps',
  description: 'Ordered process cards with derived step numbers or custom icons.',
};

export default function Page() {
  return <Demo />;
}
