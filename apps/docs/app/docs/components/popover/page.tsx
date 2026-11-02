import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Popover",
  description: "Floating panel anchored to a trigger with interactive content.",
};

export default function Page() {
  return <Demo />;
}
