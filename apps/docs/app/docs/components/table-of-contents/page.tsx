import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'TableOfContents',
  description: "Sticky 'On this page' navigation with nested levels, aria-current and a useScrollSpy hook.",
};

export default function Page() {
  return <Demo />;
}
