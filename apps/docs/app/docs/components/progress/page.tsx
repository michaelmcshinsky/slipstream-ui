import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Progress",
  description: "Determinate progress bar with role=progressbar and exact value semantics.",
};

export default function Page() {
  return <Demo />;
}
