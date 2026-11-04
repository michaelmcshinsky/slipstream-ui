import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'ConfirmDialog',
  description: 'Accessible confirmation dialog with async pending state and destructive variant.',
};

export default function Page() {
  return <Demo />;
}
