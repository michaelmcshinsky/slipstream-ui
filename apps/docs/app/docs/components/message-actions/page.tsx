import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "MessageActions",
  description: "Feedback toolbar for AI responses: copy, thumbs up/down rating, and regenerate. Every action is a callback — the component holds no conversation state.",
};

export default function Page() {
  return <Demo />;
}
