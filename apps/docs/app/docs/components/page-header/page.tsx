import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'PageHeader',
  description:
    'Standard page heading: breadcrumbs, level-1 title, description, action cluster and a sub-row slot.',
};

export default function Page() {
  return <Demo />;
}
