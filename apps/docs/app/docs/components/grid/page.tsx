import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Grid / GridItem',
  description:
    'Typed CSS grid with column counts per breakpoint, auto-fit min-column mode, and GridItem spans.',
};

export default function Page() {
  return <Demo />;
}
