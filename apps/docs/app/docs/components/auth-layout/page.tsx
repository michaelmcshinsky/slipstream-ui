import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'AuthLayout',
  description:
    'Centered authentication surface with brand, title/description, form card and footer.',
};

export default function Page() {
  return <Demo />;
}
