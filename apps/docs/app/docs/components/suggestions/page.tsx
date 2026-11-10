import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/suggestions', {
  title: "Suggestions",
  description: "Offer useful next prompts after an AI response.",
});

export default function Page() {
  return <Demo />;
}
