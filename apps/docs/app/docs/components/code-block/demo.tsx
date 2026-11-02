'use client';

import { useState } from 'react';
import { CodeBlock } from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function CodeBlockPage() {
  const [copiedAt, setCopiedAt] = useState<string | null>(null);

  return (
    <ComponentPage
      id="code-block"
      title="CodeBlock"
      description="Syntax-highlighted code with a language label and one-click copy. Used internally by Response and available standalone."
      propsRows={[
        { name: 'code', type: 'string', description: 'Raw code to display.' },
        { name: 'language', type: 'string', defaultValue: "'tsx'", description: 'Prism language identifier.' },
        { name: 'showCopyButton', type: 'boolean', defaultValue: 'true', description: 'Show/hide the copy control.' },
      ]}
      accessibility={[
        'Copy button carries an aria-label that flips to "Copied".',
        'Language label is plain text; code remains selectable.',
      ]}
    >
      <DemoCard
        title="Copy feedback"
        preview={
          <div className="w-full space-y-3">
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
        }
        code={`import { CodeBlock } from '@slipstream-ui/ai';

<CodeBlock
  language="ts"
  code={\`export const answer = 42;\`}
/>`}
      />
    </ComponentPage>
  );
}
