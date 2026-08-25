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
      description="Feedback toolbar for AI responses: copy, thumbs up/down rating, and regenerate. Every action is a callback — the component holds no conversation state."
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
    </ComponentPage>
  );
}
