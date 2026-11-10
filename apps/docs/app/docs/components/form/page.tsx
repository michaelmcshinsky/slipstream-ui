import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/form', {
  title: 'Form',
  description:
    'Semantic form element with even-spacing layouts: stacked (default), bordered card, or inline row — native submit and validation untouched.',
});

export default function Page() {
  return <Demo />;
}
