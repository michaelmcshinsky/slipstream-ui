import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Conversation",
  description: "A container for displaying a list of chat messages with auto-scroll and loading states.",
};

export default function Page() {
  return <Demo />;
}
