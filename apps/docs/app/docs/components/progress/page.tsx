import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/progress', {
  title: "Progress",
  description: "Determinate progress bar with role=progressbar and exact value semantics.",
});

export default function Page() {
  return <Demo />;
}
