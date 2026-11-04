import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Badge",
  description: "A small status indicator component for displaying tags, counts, or status information.",
};

export default function Page() {
  return <Demo />;
}
