import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Input",
  description: "A text input field with support for various input types and standard HTML input attributes.",
};

export default function Page() {
  return <Demo />;
}
