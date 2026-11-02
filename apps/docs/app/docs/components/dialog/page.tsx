import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Dialog",
  description: "Accessible modal dialog with focus trapping, escape-to-close and focus restoration.",
};

export default function Page() {
  return <Demo />;
}
