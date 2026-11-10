import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/message-actions', {
  title: "MessageActions",
  description: "Feedback toolbar for AI responses: copy, thumbs up/down rating, and regenerate. Every action is a callback — the component holds no conversation state.",
});

export default function Page() {
  return <Demo />;
}
