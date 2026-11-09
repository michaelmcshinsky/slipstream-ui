import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'DealCard',
  description: 'Deal opportunity card with sector, status, metrics, NDA/CIM badges and access actions.',
};

export default function Page() {
  return <Demo />;
}
