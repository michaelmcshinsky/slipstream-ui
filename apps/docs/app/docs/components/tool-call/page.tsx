import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/tool-call', {
  title: "ToolCall",
  description: "A component for displaying AI tool/function calls with status, arguments, and results.",
});

export default function Page() {
  return <Demo />;
}
