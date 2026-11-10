import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/fieldset', {
  title: 'Fieldset',
  description:
    'Groups related form controls in a native fieldset with a legend, optional description, and an error slot.',
});

export default function Page() {
  return <Demo />;
}
