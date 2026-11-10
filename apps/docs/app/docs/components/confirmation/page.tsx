import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/confirmation', {
  title: "Confirmation",
  description: "Human-in-the-loop approval gate for agent actions. Pauses tool execution until the user approves or rejects — the standard pattern for destructive operations.",
});

export default function Page() {
  return <Demo />;
}
