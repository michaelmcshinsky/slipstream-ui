import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/select', {
  title: "Select",
  description: "Accessible select primitive built on the native select element with controlled and uncontrolled modes.",
});

export default function Page() {
  return <Demo />;
}
