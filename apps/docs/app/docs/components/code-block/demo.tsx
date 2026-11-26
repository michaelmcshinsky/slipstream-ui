'use client';

import { CodeBlock } from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function CodeBlockPage() {
  return (
    <ComponentPage
      id="code-block"
      title="CodeBlock"
      description="Syntax-highlighted code with a language label and one-click copy: the single shared code surface: every code example on this site renders through it (also used internally by Response)."
      npmPackages="@slipstream-ui/ai"
      propsRows={[
        { name: 'code', type: 'string', description: 'Raw code to display.' },
        { name: 'language', type: 'string', defaultValue: "'tsx'", description: 'Prism language identifier.' },
        { name: 'showCopyButton', type: 'boolean', defaultValue: 'true', description: 'Show/hide the copy control.' },
        { name: 'onCopied', type: '(code: string) => void', description: 'Called with the code after a successful clipboard write.' },
      ]}
      accessibility={[
        'Copy button carries an aria-label that flips to "Copied".',
        'Language label is plain text; code remains selectable.',
      ]}
    >
      <DemoCard
        title="Copy feedback"
        preview={
          <div className="w-full">
            <CodeBlock
              language="ts"
              code={`import { Conversation } from '@slipstream-ui/ai';

export function Chat() {
  return <Conversation messages={messages} />;
}`}
            />
          </div>
        }
        code={`import { CodeBlock } from '@slipstream-ui/ai';

<CodeBlock
  language="ts"
  code={\`export const answer = 42;\`}
/>`}
        usage={`// The copy button owns its own feedback: the aria-label flips to
// "Copied" briefly after a successful write. Pass onCopied for analytics
// or custom confirmation UI.`}
      />
    </ComponentPage>
  );
}
