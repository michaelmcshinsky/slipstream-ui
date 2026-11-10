import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/time-picker', {
  title: 'TimePicker',
  description: 'Native time field with an HH:MM contract and an optional clear button.',
});

export default function Page() {
  return <Demo />;
}
