import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/card', {
  title: "Card",
  description: "Content container with header, body, and footer sections.",
});

export default function Page() {
  return <Demo />;
}
