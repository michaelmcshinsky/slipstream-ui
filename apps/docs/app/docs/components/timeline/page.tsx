import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'Timeline',
  description: 'Vertical chronology for experience, activity and audit trails.',
};

export default function Page() {
  return <Demo />;
}
