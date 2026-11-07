import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Email capture block with inline or stacked layout, pending state, success and failure feedback.',
};

export default function Page() {
  return <Demo />;
}
