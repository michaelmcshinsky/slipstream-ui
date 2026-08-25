'use client';

import { useState } from 'react';
import { Confirmation } from '@slipstream-ui/ai';
import { PropsTable } from '@/components/props-table';

export default function ConfirmationPage() {
  const [decisions, setDecisions] = useState<string[]>([]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Confirmation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Human-in-the-loop approval gate for agent actions. Pauses tool execution until the
        user approves or rejects — the standard pattern for destructive operations.
      </p>

      <h2 className="text-sm font-semibold mb-4">Live preview</h2>
      <div className="mb-8 space-y-6 max-w-lg">
        <Confirmation
          title="Delete all files in /tmp?"
          description="This affects 14 files and cannot be undone."
          toolName="delete_files"
          onApprove={() => setDecisions((d) => [...d, 'approved'])}
          onReject={() => setDecisions((d) => [...d, 'rejected'])}
        />
        <p className="text-xs text-muted-foreground">Decisions so far: {decisions.join(', ') || 'none'}</p>
      </div>

      <PropsTable
        rows={[
          { name: 'title', type: 'string', description: 'Summary of the action requiring approval.' },
          { name: 'description', type: 'string', description: 'Detail: affected resource or risk note.' },
          { name: 'toolName', type: 'string', description: 'Tool name shown as mono text.' },
          { name: 'status', type: "'pending' | 'approved' | 'rejected'", defaultValue: "'pending'", description: 'Controlled outcome; omit for uncontrolled.' },
          { name: 'onApprove', type: '() => void', description: 'Called on approval.' },
          { name: 'onReject', type: '() => void', description: 'Called on rejection.' },
          { name: 'labels', type: 'object', description: 'Label overrides for localization.' },
        ]}
      />

      <h2 className="text-2xl font-semibold mt-10 mb-4">Accessibility</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>Pending state renders <code className="bg-muted px-1 rounded">role=alertdialog</code> labeled by the title.</li>
        <li>Outcome chip announces Approved/Rejected.</li>
        <li>Never auto-approve on timeout — keep waiting or fail explicitly.</li>
      </ul>
    </div>
  );
}
