import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/message', {
  title: "Message",
  description: "A chat message component that displays messages from users, assistants, or system prompts with optional avatars.",
});

export default function Page() {
  return <Demo />;
}
