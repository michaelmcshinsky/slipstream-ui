import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/select-menu', {
  title: 'SelectMenu',
  description: 'Custom listbox select for rich options: descriptions, icons, groups and multi-select.',
});

export default function Page() {
  return <Demo />;
}
