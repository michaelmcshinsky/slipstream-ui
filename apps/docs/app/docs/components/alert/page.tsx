import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Alert",
  description: "Inline alert for status messages with semantic variants.",
};

export default function Page() {
  return <Demo />;
}
