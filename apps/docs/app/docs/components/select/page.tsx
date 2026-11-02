import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Select",
  description: "Accessible select primitive built on the native select element with controlled and uncontrolled modes.",
};

export default function Page() {
  return <Demo />;
}
