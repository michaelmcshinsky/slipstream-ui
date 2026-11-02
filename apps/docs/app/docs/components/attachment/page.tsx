import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "Attachment",
  description: "File chips for prompts and messages. Display-only — upload logic stays in your app. Attachment renders one file; AttachmentList renders a wrapping row.",
};

export default function Page() {
  return <Demo />;
}
