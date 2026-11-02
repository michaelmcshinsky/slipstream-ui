import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Textarea",
  description: "Multi-line text input styled to match Input.",
};

export default function Page() {
  return <Demo />;
}
