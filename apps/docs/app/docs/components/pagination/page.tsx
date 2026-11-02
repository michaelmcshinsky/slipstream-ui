import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Pagination",
  description: "Numeric pagination with prev/next, ellipsis, and aria-current on the active page.",
};

export default function Page() {
  return <Demo />;
}
