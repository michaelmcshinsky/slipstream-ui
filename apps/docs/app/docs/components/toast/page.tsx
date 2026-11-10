import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/toast', {
  title: "Toast",
  description: "Accessible app-level notifications announced through a polite live region, with auto-dismiss, stacking and optional actions.",
});

export default function Page() {
  return <Demo />;
}
