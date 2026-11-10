import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/autocomplete', {
  title: 'Autocomplete',
  description:
    'Type-ahead input following the HTML autocomplete model: any value is allowed while matching suggestions appear in a keyboard-navigable listbox.',
});

export default function Page() {
  return <Demo />;
}
