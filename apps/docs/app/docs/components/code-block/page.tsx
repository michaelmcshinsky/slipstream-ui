'use client';

import { useState } from 'react';
import { CodeBlock } from '@slipstream-ui/ai';
import { PropsTable } from '@/components/props-table';

export default function CodeBlockPage() {
  const [copiedAt, setCopiedAt] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">CodeBlock</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Syntax-highlighted code with a language label and one-click copy. Used internally by{' '}
        <code className="bg-muted px-1 rounded">Response</code> and available standalone.
      </p>

      <h2 className="text-sm font-semibold mb-4">Live preview</h2>
      <div className="mb-8 space-y-6">
        <CodeBlock
          language="ts"
          code={`import { Conversation } from '@slipstream-ui/ai';

export function Chat() {
  return <Conversation messages={messages} />;
}`}
        />
        <div className="text-xs text-muted-foreground">
          Last copied at: {copiedAt ?? '—'}{' '}
          <button
            type="button"
            onClick={() => setCopiedAt(new Date().toLocaleTimeString())}
            className="underline"
          >
            (copy above to update)
          </button>
        </div>
      </div>

      <PropsTable
        rows={[
          { name: 'code', type: 'string', description: 'Raw code to display.' },
          { name: 'language', type: 'string', defaultValue: "'tsx'", description: 'Prism language identifier.' },
          { name: 'showCopyButton', type: 'boolean', defaultValue: 'true', description: 'Show/hide the copy control.' },
        ]}
      />

      <h2 className="text-2xl font-semibold mt-10 mb-4">Accessibility</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>Copy button carries an aria-label that flips to “Copied”.</li>
        <li>Language label is plain text; code remains selectable.</li>
      </ul>
    </div>
  );
}
