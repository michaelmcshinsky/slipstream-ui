import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Tabs",
  description: "Tabbed content container with ARIA tablist semantics and keyboard navigation.",
};

export default function Page() {
  return <Demo />;
}
