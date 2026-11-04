import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'SectionHeading',
  description: 'Section heading block: eyebrow, title (level 2–4), description and actions.',
};

export default function Page() {
  return <Demo />;
}
