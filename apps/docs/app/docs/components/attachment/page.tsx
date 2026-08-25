'use client';

import { useState } from 'react';
import { AttachmentList } from '@slipstream-ui/ai';

export default function AttachmentPage() {
  const [attachments, setAttachments] = useState([
    { id: '1', name: 'product-spec.pdf', size: '2.4 MB', type: 'PDF', status: 'done' as const },
    { id: '2', name: 'screenshot.png', size: '480 KB', status: 'done' as const },
    { id: '3', name: 'dataset.csv', status: 'uploading' as const },
  ]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Attachment</h1>
      <p className="text-lg text-muted-foreground mb-8">
        File chips for prompts and messages. Display-only — upload logic stays in your app.
        <code className="bg-muted px-1 rounded mx-1">Attachment</code> renders one file;
        <code className="bg-muted px-1 rounded mx-1">AttachmentList</code> renders a wrapping row.
      </p>

      <div className="rounded-lg border border-border p-6 mb-8 space-y-4">
        <AttachmentList
          attachments={attachments}
          onRemove={(attachment) =>
            setAttachments((prev) => prev.filter((a) => a.id !== attachment.id))
          }
        />
      </div>

      <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mb-8">
        <code>{`import { AttachmentList } from '@slipstream-ui/ai';

<AttachmentList
  attachments={[
    { id: '1', name: 'spec.pdf', size: '2.4 MB', status: 'done' },
    { id: '2', name: 'data.csv', status: 'uploading' },
  ]}
  onRemove={(attachment) => remove(attachment.id)}
/>`}</code>
      </pre>

      <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm mb-8">
        <li>Remove controls include the file name in their accessible label.</li>
        <li>The uploading state is announced via <code className="bg-muted px-1 rounded">role=status</code>.</li>
        <li>Thumbnails are aria-hidden; file names carry the meaning.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">When to use</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>Show files queued on a prompt before sending.</li>
        <li>Show files the assistant referenced in a response.</li>
        <li>Do not use chips as drag-and-drop targets — build dropzones in your app.</li>
      </ul>
    </div>
  );
}
