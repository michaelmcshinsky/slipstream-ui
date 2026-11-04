import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Link',
  description: 'Inline link primitive with variants, asChild router support and safe external handling.',
};

export default function Page() {
  return <Demo />;
}
