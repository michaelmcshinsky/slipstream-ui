import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'SiteFooter',
  description: 'Marketing footer with brand, link columns and a legal bar.',
};

export default function Page() {
  return <Demo />;
}
