import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: 'AppShell',
  description:
    'Application frame: sectioned sidebar, sticky header and scrolling main; the sidebar becomes a mobile drawer with a built-in burger button.',
};

export default function Page() {
  return <Demo />;
}
