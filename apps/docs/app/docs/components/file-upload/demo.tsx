'use client';

import { useState } from 'react';
import { FileUpload, FormField } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function FileUploadPage() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <ComponentPage
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
      ]}
      accessibility={['The visible label targets a real (sr-only) file input, so keyboard and mobile file dialogs work.', 'Uploading files expose role=progressbar with a name.']}
    >
      <DemoCard
        title="Attachments (interactive)"
        preview={
          <div className="w-full max-w-lg">
            <FormField id="fu-files" label="Attachments" hint="PDF or CSV, up to 10 MB each">
              <FileUpload
                files={files}
                onFilesChange={setFiles}
                accept=".pdf,.csv"
                progress={files.length ? { [files[0].name]: 42 } : undefined}
              />
            </FormField>
          </div>
        }
        code={`const [files, setFiles] = useState<File[]>([]);

<FileUpload
  files={files}
  onFilesChange={setFiles}
  accept=".pdf,.csv"
  progress={{ [files[0]?.name]: 42 }}
/>`}
        usage={`// Files are plain File objects — you own the transport. Key progress by
// file name and pass it in while uploading.`}
        types={`type FileUploadProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'> & {
  files?: File[];
  defaultFiles?: File[];
  onFilesChange?: (files: File[]) => void;
  label?: string;
  hint?: string;
  progress?: Record<string, number>;
};`}
      />
    </ComponentPage>
  );
}
