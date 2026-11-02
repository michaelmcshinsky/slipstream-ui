import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Menu",
  description: "Dropdown menu with keyboard navigation and ARIA menu semantics.",
};

export default function Page() {
  return <Demo />;
}
