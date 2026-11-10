import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/form-field', {
  title: 'FormField',
  description:
    'Label + control + hint/error in one unit with htmlFor, aria-describedby, and aria-invalid wiring applied automatically.',
});

export default function Page() {
  return <Demo />;
}
