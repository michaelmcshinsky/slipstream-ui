import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'TableCard',
  description: 'Table shell with title, actions, toolbar, edge-to-edge body and footer.',
};

export default function Page() {
  return <Demo />;
}
