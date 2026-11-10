import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/conversation', {
  title: "Conversation",
  description: "A container for displaying a list of chat messages with auto-scroll and loading states.",
});

export default function Page() {
  return <Demo />;
}
