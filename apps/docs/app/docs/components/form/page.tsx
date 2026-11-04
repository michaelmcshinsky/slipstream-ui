import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Form',
  description:
    'Semantic form element with even-spacing layouts: stacked (default), bordered card, or inline row — native submit and validation untouched.',
};

export default function Page() {
  return <Demo />;
}
