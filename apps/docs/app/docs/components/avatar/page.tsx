import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Avatar",
  description: "A user profile image component with fallback support and accessible image loading.",
};

export default function Page() {
  return <Demo />;
}
