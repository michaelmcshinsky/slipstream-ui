import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/button-group', {
  title: 'ButtonGroup',
  description:
    'Joins buttons into one segmented control: adjacent borders collapse, middle corners square off, only the outer corners stay rounded.',
});

export default function Page() {
  return <Demo />;
}
