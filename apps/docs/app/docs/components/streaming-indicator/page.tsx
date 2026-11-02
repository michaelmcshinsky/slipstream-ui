import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "StreamingIndicator",
  description: "Give immediate feedback while an assistant response is arriving.",
};

export default function Page() {
  return <Demo />;
}
