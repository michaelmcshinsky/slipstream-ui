import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/pagination', {
  title: "Pagination",
  description: "Numeric pagination with prev/next, ellipsis, and aria-current on the active page.",
});

export default function Page() {
  return <Demo />;
}
