import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'DocumentCard',
  description: 'Document row with file metadata, access status and an optional download action.',
};

export default function Page() {
  return <Demo />;
}
