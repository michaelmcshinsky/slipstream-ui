import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Sources",
  description: "Show citations and references alongside an AI response. Sources renders a numbered list; Source renders a single citation for custom layouts.",
};

export default function Page() {
  return <Demo />;
}
