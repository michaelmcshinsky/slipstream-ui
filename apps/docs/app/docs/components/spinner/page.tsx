import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Spinner",
  description: "Indeterminate loading indicator with accessible status semantics.",
};

export default function Page() {
  return <Demo />;
}
