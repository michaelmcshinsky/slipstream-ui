import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/attachment', {
  title: "Attachment",
  description: "File chips for prompts and messages. Display-only: upload logic stays in your app. Attachment renders one file; AttachmentList renders a wrapping row.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('attachment')}
      id="attachment"
      title="Attachment"
      description="File chips for prompts and messages. Display-only: upload logic stays in your app. Attachment renders one file; AttachmentList renders a wrapping row."
      npmPackages="@slipstream-ui/ai"
      propsRows={[
        { name: 'attachment', type: 'AttachmentItem', description: 'Single file chip (Attachment).' },
        { name: 'attachments', type: 'AttachmentItem[]', description: 'File list rendered as a wrapping row (AttachmentList).' },
        { name: 'onRemove', type: '(attachment: AttachmentItem) => void', description: 'Remove callback; omit to hide the remove control.' },
      ]}
      accessibility={[
        'Remove controls include the file name in their accessible label.',
        'The uploading state is announced via role=status.',
        'Thumbnails are aria-hidden; file names carry the meaning.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
