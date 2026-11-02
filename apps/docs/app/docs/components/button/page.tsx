import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Button",
  description: "A clickable button component with variants for different visual styles and sizes.",
};

export default function Page() {
  return <Demo />;
}
