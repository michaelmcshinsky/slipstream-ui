import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Text',
  description:
    'Semantic paragraph text with a controlled type scale; renders a real p (or span with inline).',
};

export default function Page() {
  return <Demo />;
}
