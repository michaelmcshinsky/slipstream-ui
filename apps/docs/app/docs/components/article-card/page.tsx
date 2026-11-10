import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/article-card', {
  title: 'ArticleCard',
  description: 'Linked article or resource card with media, eyebrow, title, summary and metadata.',
});

export default function Page() {
  return <Demo />;
}
