import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "PromptInput",
  description: "Auto-resizing chat input with Enter-to-send, Shift+Enter for newlines, and a stop-generation button while a response is in flight. Also composes as a compound primitive set for custom layouts.",
};

export default function Page() {
  return <Demo />;
}
