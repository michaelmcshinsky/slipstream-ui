import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Checkbox",
  description: "Native checkbox input styled to match the design system, with controlled and uncontrolled support.",
};

export default function Page() {
  return <Demo />;
}
