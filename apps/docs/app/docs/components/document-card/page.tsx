import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/document-card', {
  title: 'DocumentCard',
  description: 'Document row with file metadata, access status and an optional download action.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('document-card')}
      id="document-card"
      title="DocumentCard"
      description="Document row with file metadata, access status and an optional download action."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'name', type: 'string', defaultValue: 'required', description: 'File name.' },
        { name: 'fileType', type: 'string', defaultValue: 'required', description: 'Short file type label, such as PDF or XLSX.' },
        { name: 'size', type: 'string', description: 'Human-readable file size.' },
        { name: 'updatedAt', type: 'string', description: 'Updated date or relative time.' },
        { name: 'status', type: "'available' | 'restricted' | 'pending'", defaultValue: "'available'", description: 'Access state.' },
        { name: 'onDownload', type: '() => void', description: 'Download handler; omit for a display-only row.' },
        { name: 'downloadLabel', type: 'string', defaultValue: "'Download'", description: 'Download button label.' },
        { name: 'icon', type: 'ReactNode', description: 'Custom file icon slot.' },
      ]}
      accessibility={[
        'The download button is named Download <file name>.',
        'Status is a text badge; restricted downloads are disabled.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
