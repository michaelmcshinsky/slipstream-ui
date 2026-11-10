import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/testimonial', {
  title: 'Testimonial',
  description: 'Semantic written testimonial with quote, person, role, company, avatar and logo slots.',
});

export default function Page() {
  return <Demo />;
}
