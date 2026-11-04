import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Separator",
  description: "Visual divider between content blocks, decorative or semantic.",
};

export default function Page() {
  return <Demo />;
}
