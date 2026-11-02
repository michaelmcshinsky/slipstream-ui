import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Suggestions",
  description: "Offer useful next prompts after an AI response.",
};

export default function Page() {
  return <Demo />;
}
