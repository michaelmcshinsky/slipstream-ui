import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/checkbox', {
  title: "Checkbox",
  description: "Native checkbox input styled to match the design system, with controlled and uncontrolled support.",
});

export default function Page() {
  return <Demo />;
}
