import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/file-upload', {
  title: 'FileUpload',
  description: 'Drag-and-drop file picker with a removable list and per-file progress bars.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('file-upload')}
      id="file-upload"
      title="FileUpload"
      description="Drag-and-drop file picker with a removable file list and per-file progress bars."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'files', type: 'File[]', description: 'Controlled selection.' },
        { name: 'defaultFiles', type: 'File[]', description: 'Initial selection when uncontrolled.' },
        { name: 'onFilesChange', type: '(files: File[]) => void', description: 'Fired on add, drop and remove.' },
        { name: 'label', type: 'string', description: 'Drop-zone copy.' },
        { name: 'hint', type: 'string', description: 'Helper line under the drop zone.' },
        { name: 'progress', type: 'Record<string, number>', description: 'Per-file progress 0–100 keyed by file name.' },
        { name: 'accept / multiple', type: 'string | boolean', description: 'Native input constraints pass through.' },
        { name: 'selectedFilesLabel', type: 'string', defaultValue: "'Selected files'", description: 'aria-label for the selected-files list.' },
        { name: 'removeLabel', type: '(file: File) => string', defaultValue: 'Remove <name>', description: 'Per-file remove button label.' },
        { name: 'uploadingLabel', type: '(file: File) => string', defaultValue: 'Uploading <name>', description: 'Progress indicator label while a file uploads.' },
      ]}
      accessibility={['The visible label targets a real (sr-only) file input, so keyboard and mobile file dialogs work.', 'Uploading files expose role=progressbar with a name.']}
    >
      <Demo />
    </ComponentPage>
  );
}
