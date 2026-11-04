import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'SiteHeader',
  description: 'Sticky marketing header with prefix-aware nav, actions and a mobile drawer.',
};

export default function Page() {
  return <Demo />;
}
