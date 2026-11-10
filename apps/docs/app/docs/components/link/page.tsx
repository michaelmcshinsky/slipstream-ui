import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/link', {
  title: 'Link',
  description: 'Inline link primitive with variants, asChild router support and safe external handling.',
});

export default function Page() {
  return <Demo />;
}
