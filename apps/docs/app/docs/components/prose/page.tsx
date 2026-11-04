import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Prose',
  description: 'Self-contained long-form typography for rendered markdown/MDX.',
};

export default function Page() {
  return <Demo />;
}
