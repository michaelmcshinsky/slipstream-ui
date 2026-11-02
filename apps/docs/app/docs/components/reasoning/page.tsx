import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Reasoning",
  description: "A collapsible component for displaying AI reasoning steps and chain-of-thought processes.",
};

export default function Page() {
  return <Demo />;
}
