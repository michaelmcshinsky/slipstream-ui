import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/switch', {
  title: "Switch",
  description: "Toggle switch for binary settings, with role=switch and aria-checked.",
});

export default function Page() {
  return <Demo />;
}
