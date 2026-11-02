import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Message",
  description: "A chat message component that displays messages from users, assistants, or system prompts with optional avatars.",
};

export default function Page() {
  return <Demo />;
}
