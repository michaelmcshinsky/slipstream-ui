import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'LogoCloud',
  description: 'Trust strip for member, customer or partner logos with captions, columns and optional links.',
};

export default function Page() {
  return <Demo />;
}
