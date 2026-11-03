'use client';

import { useState } from 'react';
import { Confirmation } from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function ConfirmationPage() {
  const [decisions, setDecisions] = useState<string[]>([]);

  return (
    <ComponentPage
      id="confirmation"
      title="Confirmation"
      description="Human-in-the-loop approval gate for agent actions. Pauses tool execution until the user approves or rejects — the standard pattern for destructive operations."
      propsRows={[
        { name: 'title', type: 'string', description: 'Summary of the action requiring approval.' },
        { name: 'description', type: 'string', description: 'Detail: affected resource or risk note.' },
        { name: 'toolName', type: 'string', description: 'Tool name shown as mono text.' },
        { name: 'status', type: "'pending' | 'approved' | 'rejected'", defaultValue: "'pending'", description: 'Controlled outcome; omit for uncontrolled.' },
        { name: 'variant', type: "'default' | 'warning' | 'destructive' | 'info' | 'success'", defaultValue: "'default'", description: 'Accent color of the pending card; outcome chips always follow the result.' },
        { name: 'onApprove', type: '() => void', description: 'Called on approval.' },
        { name: 'onReject', type: '() => void', description: 'Called on rejection.' },
        { name: 'labels', type: 'object', description: 'Label overrides for localization.' },
      ]}
      accessibility={[
        'Pending state renders role=alertdialog labeled by the title.',
        'Outcome chip announces Approved/Rejected.',
        'Never auto-approve on timeout — keep waiting or fail explicitly.',
      ]}
    >
      <DemoCard
        title="Approval gate"
        preview={
          <div className="w-full max-w-lg space-y-4">
            <Confirmation
              title="Delete all files in /tmp?"
              description="This affects 14 files and cannot be undone."
              toolName="delete_files"
              onApprove={() => setDecisions((d) => [...d, 'approved'])}
              onReject={() => setDecisions((d) => [...d, 'rejected'])}
            />
            <p className="text-xs text-muted-foreground">Decisions so far: {decisions.join(', ') || 'none'}</p>
          </div>
        }
        code={`import { Confirmation } from '@slipstream-ui/ai';

<Confirmation
  title="Delete all files in /tmp?"
  description="This affects 14 files and cannot be undone."
  toolName="delete_files"
  onApprove={() => approve()}
  onReject={() => reject()}
/>`}
      />

      <DemoCard
        title="Color variants"
        preview={
          <div className="grid w-full gap-4 md:grid-cols-2">
            <Confirmation
              title="Destructive action"
              description="Variant sets the pending card accent; the result chip still encodes the outcome."
              variant="destructive"
            />
            <Confirmation title="Info gate" description="Neutral blue accent for non-risky pauses." variant="info" />
            <Confirmation title="Success flow" description="Green accent for confirm-to-continue steps." variant="success" />
            <Confirmation title="Warning (default)" description="The default amber accent — same as omitting variant." />
          </div>
        }
        code={`import { Confirmation } from '@slipstream-ui/ai';

{/* Accent the pending card by risk profile */}
<Confirmation title="Delete all files" variant="destructive" … />
<Confirmation title="Publish to production" variant="info" … />
<Confirmation title="Activate license" variant="success" … />
<Confirmation title="Publish release" variant="warning" … />   {/* default */}`}
        usage={`import { Confirmation } from '@slipstream-ui/ai';

// Controlled outcome with a color hint
<Confirmation
  title="Send to all 2,400 users?"
  variant="destructive"
  status={decision}
  onApprove={approve}
  onReject={reject}
/>`}
        types={`type ConfirmationVariant =
  | 'default'
  | 'warning'
  | 'destructive'
  | 'info'
  | 'success';`}
      />
    </ComponentPage>
  );
}
