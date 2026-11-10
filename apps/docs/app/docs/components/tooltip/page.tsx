import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/tooltip', {
  title: "Tooltip",
  description: "Hover/focus tooltip with aria-describedby association and Escape dismissal.",
});

export default function Page() {
  return <Demo />;
}
