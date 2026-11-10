import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/confirm-dialog', {
  title: 'ConfirmDialog',
  description: 'Accessible confirmation dialog with async pending state and destructive variant.',
});

export default function Page() {
  return <Demo />;
}
