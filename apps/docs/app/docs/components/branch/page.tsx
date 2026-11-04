import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Branch",
  description: "Variant navigation for branched messages: ‹ N / M › controls that let users compare alternative AI responses. Purely presentational — you swap the content.",
};

export default function Page() {
  return <Demo />;
}
