import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/input', {
  title: "Input",
  description: "A text input field with support for various input types and standard HTML input attributes.",
});

export default function Page() {
  return <Demo />;
}
