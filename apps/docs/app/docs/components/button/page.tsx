import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/button', {
  title: "Button",
  description: "A clickable button component with variants for different visual styles and sizes.",
});

export default function Page() {
  return <Demo />;
}
