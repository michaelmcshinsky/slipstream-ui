import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'FileUpload',
  description: 'Drag-and-drop file picker with a removable list and per-file progress bars.',
};

export default function Page() {
  return <Demo />;
}
