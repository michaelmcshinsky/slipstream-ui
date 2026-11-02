import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Card",
  description: "Content container with header, body, and footer sections.",
};

export default function Page() {
  return <Demo />;
}
