import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Accordion",
  description: "Collapsible content sections with ARIA accordion semantics.",
};

export default function Page() {
  return <Demo />;
}
