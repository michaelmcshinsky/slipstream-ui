import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/section-heading', {
  title: 'SectionHeading',
  description: 'Section heading block: eyebrow, title (level 2–4), description and actions.',
});

export default function Page() {
  return <Demo />;
}
