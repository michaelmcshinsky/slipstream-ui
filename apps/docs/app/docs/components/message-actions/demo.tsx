'use client';

import { useState } from 'react';
import { Message, MessageActions } from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function MessageActionsPage() {
  const [rating, setRating] = useState<'up' | 'down' | undefined>();
  const [regenerations, setRegenerations] = useState(0);

  return (
    <ComponentPage
      id="message-actions"
      title="MessageActions"
      description="Feedback toolbar for AI responses: copy, thumbs up/down rating, and regenerate. Every action is a callback: the component holds no conversation state."
      npmPackages="@slipstream-ui/ai"
      propsRows={[
        { name: 'content', type: 'string', description: 'Text copied by the copy action; omit to hide copy.' },
        { name: 'onCopy', type: '(content: string) => void', description: 'Called after the user copies the message.' },
        { name: 'onFeedback', type: "(rating: FeedbackRating | undefined) => void", description: 'Rating callback; selecting the same rating clears it.' },
        { name: 'onRegenerate', type: '() => void', description: 'Regenerate callback; omit to hide the action.' },
        { name: 'autohide', type: "'always' | 'on-hover' | 'not-last'", defaultValue: "'always'", description: 'Visibility rule; hover modes reveal on parent hover/focus.' },
        { name: 'labels', type: 'object', description: 'Localizable copy/copied/thumbUp/thumbDown/regenerate labels.' },
        { name: 'className', type: 'string', description: 'Additional classes for the toolbar root.' },
      ]}
      accessibility={[
        'Root has role=toolbar with an accessible name.',
        'Rating buttons expose aria-pressed selection state.',
        'All labels are localizable via the labels prop.',
      ]}
    >
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
    </ComponentPage>
  );
}
