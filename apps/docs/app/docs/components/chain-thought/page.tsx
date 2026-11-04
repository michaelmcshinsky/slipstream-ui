import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "ChainThought",
  description: "Show ordered agent work with explicit progress status.",
};

export default function Page() {
  return <Demo />;
}
