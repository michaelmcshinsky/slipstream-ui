import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/skeleton', {
  title: "Skeleton",
  description: "Loading placeholder that mirrors the shape of upcoming content.",
});

export default function Page() {
  return <Demo />;
}
