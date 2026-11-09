import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'TableOfContents',
  description:
    "Sticky 'On this page' navigation with real anchor links, nested levels, aria-current, and a useScrollSpy hook for the active heading.",
};

export default function Page() {
  return <Demo />;
}
