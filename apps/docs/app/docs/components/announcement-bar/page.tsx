import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'AnnouncementBar',
  description: 'Dismissible announcement bar with optional action, tone and sticky positioning.',
};

export default function Page() {
  return <Demo />;
}
