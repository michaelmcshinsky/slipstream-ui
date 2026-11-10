import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/code-block', {
  title: "CodeBlock",
  description: "Syntax-highlighted code with a language label and one-click copy. Used internally by Response and available standalone.",
});

export default function Page() {
  return <Demo />;
}
