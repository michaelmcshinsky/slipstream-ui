import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/menu', {
  title: "Menu",
  description: "Dropdown menu with keyboard navigation and ARIA menu semantics.",
});

export default function Page() {
  return <Demo />;
}
