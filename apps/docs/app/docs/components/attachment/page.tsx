import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/attachment', {
  title: "Attachment",
  description: "File chips for prompts and messages. Display-only — upload logic stays in your app. Attachment renders one file; AttachmentList renders a wrapping row.",
});

export default function Page() {
  return <Demo />;
}
