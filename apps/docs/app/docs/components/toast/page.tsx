import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Toast",
  description: "Accessible app-level notifications announced through a polite live region, with auto-dismiss, stacking and optional actions.",
};

export default function Page() {
  return <Demo />;
}
