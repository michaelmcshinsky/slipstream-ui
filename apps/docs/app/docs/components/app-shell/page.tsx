import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/app-shell', {
  title: 'AppShell',
  description:
    'Application frame: sectioned sidebar, sticky header and scrolling main; the sidebar becomes a mobile drawer with a built-in burger button.',
});

export default function Page() {
  return <Demo />;
}
