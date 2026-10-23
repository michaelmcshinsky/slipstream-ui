'use client';

import { useState } from 'react';
import { AttachmentList } from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function AttachmentPage() {
  const [attachments, setAttachments] = useState([
    { id: '1', name: 'product-spec.pdf', size: '2.4 MB', type: 'PDF', status: 'done' as const },
    { id: '2', name: 'screenshot.png', size: '480 KB', status: 'done' as const },
    { id: '3', name: 'dataset.csv', status: 'uploading' as const },
  ]);

  return (
    <ComponentPage
      id="attachment"
      title="Attachment"
      description="File chips for prompts and messages. Display-only — upload logic stays in your app. Attachment renders one file; AttachmentList renders a wrapping row."
      accessibility={[
        'Remove controls include the file name in their accessible label.',
        'The uploading state is announced via role=status.',
        'Thumbnails are aria-hidden; file names carry the meaning.',
      ]}
    >
      <DemoCard
        title="AttachmentList"
        preview={
          <div className="w-full space-y-4">
            <AttachmentList
              attachments={attachments}
              onRemove={(attachment) =>
                setAttachments((prev) => prev.filter((a) => a.id !== attachment.id))
              }
            />
          </div>
        }
        code={`import { AttachmentList } from '@slipstream-ui/ai';

<AttachmentList
  attachments={[
    { id: '1', name: 'spec.pdf', size: '2.4 MB', status: 'done' },
    { id: '2', name: 'data.csv', status: 'uploading' },
  ]}
  onRemove={(attachment) => remove(attachment.id)}
/>`}
      />
    </ComponentPage>
  );
}
