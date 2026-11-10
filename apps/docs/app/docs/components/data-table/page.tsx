import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/data-table', {
  title: 'DataTable',
  description:
    'Config-driven table: one component plus a columns config that owns shape, sorting, pagination, and row interaction.',
});

export default function Page() {
  return <Demo />;
}
