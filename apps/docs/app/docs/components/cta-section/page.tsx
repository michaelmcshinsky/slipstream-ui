import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'CTASection',
  description: 'Full-width conversion band with eyebrow, headline, supporting copy and actions.',
};

export default function Page() {
  return <Demo />;
}
