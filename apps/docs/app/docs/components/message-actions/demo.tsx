'use client';

import { useState } from 'react';
import { Message, MessageActions } from '@slipstream-ui/ai';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  const [rating, setRating] = useState<'up' | 'down' | undefined>();
  const [regenerations, setRegenerations] = useState(0);

  return (
    <>
      <DemoCard
        title="Feedback toolbar"
        preview={
          <div className="w-full">
            <Message
              message={{
                id: 'demo',
                role: 'assistant',
                content: 'Slipstream UI components are stateless: you own the data flow.',
              }}
            />
            <div className="mt-2 pl-12">
              <MessageActions
                content="Slipstream UI components are stateless: you own the data flow."
                onFeedback={setRating}
                onRegenerate={() => setRegenerations((n) => n + 1)}
              />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Rating: {rating ?? 'none'} · Regenerations: {regenerations}
            </p>
          </div>
        }
        code={`import { MessageActions } from '@slipstream-ui/ai';

<MessageActions
  content={message.content}
  onCopy={(text) => navigator.clipboard.writeText(text)}
  onFeedback={(rating) => analytics.track(rating)}   // 'up' | 'down' | undefined
  onRegenerate={() => regenerate(message.id)}
  labels={{ copy: 'Copy', thumbUp: 'Good response' }}
/>`}
      />
      <DemoCard
        title="Autohide on hover"
        preview={
          <div className="w-full space-y-3">
            <p className="text-xs text-muted-foreground">
              Hover or focus the message group: the toolbar fades in. It stays visible while focus is inside.
            </p>
            <div className="group rounded-lg border border-border p-3">
              <Message
                message={{
                  id: 'demo-2',
                  role: 'assistant',
                  content: 'Hover me — the actions appear on group hover.',
                }}
              />
              <div className="mt-2 pl-12 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                <MessageActions
                  autohide="on-hover"
                  content="Hover me — the actions appear on group hover."
                  onFeedback={setRating}
                  labels={{ copy: 'Copy response', thumbUp: 'Helpful', thumbDown: 'Not helpful', regenerate: 'Try again' }}
                />
              </div>
            </div>
          </div>
        }
        code={`<div className="group">
  <Message message={message} />
  <MessageActions
    autohide="on-hover"        // visible on parent hover/focus
    content={message.content}
    onFeedback={setRating}
    labels={{ copy: 'Copy response', thumbUp: 'Helpful' }}
  />
</div>`}
        usage={`// autohide="on-hover" expects a parent with the Tailwind "group"
// class (or your own hover/focus wiring): the component only renders
// the toolbar; visibility is yours to style. autohide="not-last" hides
// the toolbar on every message except the latest.`}
      />
    </>
  );
}
