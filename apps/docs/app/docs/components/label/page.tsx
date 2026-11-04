import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Label",
  description: "Accessible form label that associates with its control.",
};

export default function Page() {
  return <Demo />;
}
