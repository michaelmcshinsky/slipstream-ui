import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'FeatureGrid',
  description: 'Grid of feature or benefit cards with an icon, title, copy and optional link.',
};

export default function Page() {
  return <Demo />;
}
