import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "InlineCitation",
  description: "Perplexity-style inline citation: a superscript chip that reveals the source title and snippet on hover or keyboard focus. Use it to attribute individual claims inside a response; use Sources for the footer list.",
};

export default function Page() {
  return <Demo />;
}
