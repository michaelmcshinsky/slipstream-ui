'use client';

import { CodeBlock } from '@slipstream-ui/ai';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
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
    </>
  );
}
