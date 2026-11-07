import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Container',
  description: 'Centered, width-constrained page container with shared gutters and four width presets.',
};

export default function Page() {
  return <Demo />;
}
