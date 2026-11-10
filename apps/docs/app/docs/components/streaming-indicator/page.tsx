import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/streaming-indicator', {
  title: "StreamingIndicator",
  description: "Give immediate feedback while an assistant response is arriving.",
});

export default function Page() {
  return <Demo />;
}
