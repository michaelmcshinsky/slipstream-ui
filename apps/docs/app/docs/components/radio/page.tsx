import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/radio', {
  title: "Radio",
  description: "Native radio buttons grouped for mutually exclusive choices.",
});

export default function Page() {
  return <Demo />;
}
