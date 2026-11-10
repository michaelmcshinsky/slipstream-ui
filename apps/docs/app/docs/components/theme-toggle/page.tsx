import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/theme-toggle', {
  title: 'ThemeToggle',
  description: 'Presentational light/dark toggle with accessible labels and sun/moon state.',
});

export default function Page() {
  return <Demo />;
}
