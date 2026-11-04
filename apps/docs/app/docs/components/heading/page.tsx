import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Heading',
  description:
    'Semantic heading (h1-h6) with a safe default scale and an optional visual-size override.',
};

export default function Page() {
  return <Demo />;
}
