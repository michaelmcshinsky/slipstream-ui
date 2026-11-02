import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "ToolCall",
  description: "A component for displaying AI tool/function calls with status, arguments, and results.",
};

export default function Page() {
  return <Demo />;
}
