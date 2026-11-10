import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/label', {
  title: "Label",
  description: "Accessible form label that associates with its control.",
});

export default function Page() {
  return <Demo />;
}
