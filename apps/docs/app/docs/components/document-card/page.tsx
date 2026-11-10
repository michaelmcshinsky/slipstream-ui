import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/document-card', {
  title: 'DocumentCard',
  description: 'Document row with file metadata, access status and an optional download action.',
});

export default function Page() {
  return <Demo />;
}
