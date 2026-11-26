'use client';

import { useState } from 'react';
import { FileUpload, FormField } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <>
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
        usage={`// Files are plain File objects: you own the transport. Key progress by
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
    </>
  );
}
