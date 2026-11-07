import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'ArticleCard',
  description: 'Linked article or resource card with media, eyebrow, title, summary and metadata.',
};

export default function Page() {
  return <Demo />;
}
