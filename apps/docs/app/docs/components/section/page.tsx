import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/section', {
  title: 'Section',
  description: 'Full-width page section with a surface tone, vertical rhythm and an optional centered container.',
});

export default function Page() {
  return <Demo />;
}
