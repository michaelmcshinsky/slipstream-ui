import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/breadcrumb', {
  title: "Breadcrumb",
  description: "Navigation breadcrumb trail with links and current-page indicator.",
});

export default function Page() {
  return <Demo />;
}
