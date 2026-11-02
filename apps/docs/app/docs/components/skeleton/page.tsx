import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Skeleton",
  description: "Loading placeholder that mirrors the shape of upcoming content.",
};

export default function Page() {
  return <Demo />;
}
