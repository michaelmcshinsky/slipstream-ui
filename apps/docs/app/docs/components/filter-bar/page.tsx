import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'FilterBar',
  description:
    'List-page filter strip: search field, filter controls, reset affordance and trailing actions.',
};

export default function Page() {
  return <Demo />;
}
