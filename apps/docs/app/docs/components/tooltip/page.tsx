import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Tooltip",
  description: "Hover/focus tooltip with aria-describedby association and Escape dismissal.",
};

export default function Page() {
  return <Demo />;
}
