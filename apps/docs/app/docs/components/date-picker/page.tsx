import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/date-picker', {
  title: 'DatePicker',
  description: 'Native date field with an ISO-string contract and an optional clear button.',
});

export default function Page() {
  return <Demo />;
}
