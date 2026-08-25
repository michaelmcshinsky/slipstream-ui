'use client';

import { useState } from 'react';
import { Message, MessageActions } from '@slipstream-ui/ai';
import { CodeBlock } from '@/components/code-block';

export default function MessageActionsPage() {
  const [rating, setRating] = useState<'up' | 'down' | undefined>();
  const [regenerations, setRegenerations] = useState(0);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">MessageActions</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Feedback toolbar for AI responses: copy, thumbs up/down rating, and regenerate.
        Every action is a callback — the component holds no conversation state.
      </p>

      <div className="rounded-lg border border-border p-6 mb-8">
        <Message
          message={{
            id: 'demo',
            role: 'assistant',
            content: 'Slipstream UI components are stateless — you own the data flow.',
          }}
        />
        <div className="mt-2 pl-12">
          <MessageActions
            content="Slipstream UI components are stateless — you own the data flow."
            onFeedback={setRating}
            onRegenerate={() => setRegenerations((n) => n + 1)}
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Rating: {rating ?? 'none'} · Regenerations: {regenerations}
        </p>
      </div>

      <CodeBlock className="mb-8">{`import { MessageActions } from '@slipstream-ui/ai';

<MessageActions
  content={message.content}
  onCopy={(text) => navigator.clipboard.writeText(text)}
  onFeedback={(rating) => analytics.track(rating)}   // 'up' | 'down' | undefined
  onRegenerate={() => regenerate(message.id)}
  labels={{ copy: 'Copy', thumbUp: 'Good response' }}
/>`}</CodeBlock>

      <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm mb-8">
        <li>Root has <code className="bg-muted px-1 rounded">role=toolbar</code> with an accessible name.</li>
        <li>Rating buttons expose <code className="bg-muted px-1 rounded">aria-pressed</code> selection state.</li>
        <li>All labels are localizable via the <code className="bg-muted px-1 rounded">labels</code> prop.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-4">When to use</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>Render below an assistant Message bubble to collect trust signals.</li>
        <li>Omit props to hide actions: no <code className="bg-muted px-1 rounded">content</code> hides copy; no <code className="bg-muted px-1 rounded">onRegenerate</code> hides regenerate.</li>
      </ul>
    </div>
  );
}
