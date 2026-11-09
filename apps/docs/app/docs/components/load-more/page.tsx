import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'LoadMore',
  description: 'Load-more control with pending and end-of-list states.',
};

export default function Page() {
  return <Demo />;
}
