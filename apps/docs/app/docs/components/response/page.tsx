import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Response",
  description: "Streaming-optimized markdown renderer for AI responses: GitHub-flavored markdown, automatic repair of incomplete syntax while tokens arrive, and code blocks routed through CodeBlock.",
};

export default function Page() {
  return <Demo />;
}
