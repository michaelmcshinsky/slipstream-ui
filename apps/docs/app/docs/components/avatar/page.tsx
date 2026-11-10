import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/avatar', {
  title: "Avatar",
  description: "A user profile image component with fallback support and accessible image loading.",
});

export default function Page() {
  return <Demo />;
}
