import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/newsletter', {
  title: 'Newsletter',
  description: 'Email capture block with inline or stacked layout, pending state, success and failure feedback.',
});

export default function Page() {
  return <Demo />;
}
