import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Switch",
  description: "Toggle switch for binary settings, with role=switch and aria-checked.",
};

export default function Page() {
  return <Demo />;
}
