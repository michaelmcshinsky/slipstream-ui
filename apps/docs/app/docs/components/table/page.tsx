import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Table",
  description: "Semantic data table with headers, body, footer, and accessible caption.",
};

export default function Page() {
  return <Demo />;
}
