import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/file-upload', {
  title: 'FileUpload',
  description: 'Drag-and-drop file picker with a removable list and per-file progress bars.',
});

export default function Page() {
  return <Demo />;
}
