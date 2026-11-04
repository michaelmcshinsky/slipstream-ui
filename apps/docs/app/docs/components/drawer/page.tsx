import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Drawer',
  description:
    'Edge sheet for secondary flows: slides from any side (sm/md/lg), with Dialog-grade modal semantics (portal, focus trap, Escape, focus restoration).',
};

export default function Page() {
  return <Demo />;
}
