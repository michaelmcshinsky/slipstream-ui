import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/date-picker-popover', {
  title: 'DatePickerPopover',
  description: 'Date field with a Calendar panel, ISO strings, min/max and keyboard selection.',
});

export default function Page() {
  return <Demo />;
}
