import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Block',
  description:
    'Semantic container (div by default, swappable element) — the structural counterpart to Text (p).',
};

export default function Page() {
  return <Demo />;
}
