'use client';

import { useState } from 'react';
import { Branch, Message } from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

const VARIANTS = [
  'The capital of France is Paris.',
  "It's Paris — home to roughly two million people.",
  'Paris is the capital and largest city of France.',
];

export default function BranchPage() {
  const [selected, setSelected] = useState(0);

  return (
    <ComponentPage
      id="branch"
      title="Branch"
      description="Variant navigation for branched messages: ‹ N / M › controls that let users compare alternative AI responses. Purely presentational — you swap the content."
      propsRows={[
        { name: 'count', type: 'number', description: 'Total variants; renders nothing below 2.' },
        { name: 'selected', type: 'number', description: 'Controlled zero-based index.' },
        { name: 'defaultSelected', type: 'number', defaultValue: '0', description: 'Uncontrolled initial index.' },
        { name: 'onSelect', type: '(index: number) => void', description: 'Called with the chosen variant index.' },
        { name: 'labels', type: 'object', description: 'Overrides for previous/next aria-labels.' },
      ]}
      accessibility={[
        'Arrows disable at the ends instead of wrapping silently.',
        'Position indicator uses aria-live=polite.',
      ]}
    >
      <DemoCard
        title="Variant switching"
        preview={
          <div className="w-full max-w-xl space-y-3">
            <Message message={{ id: 'v', role: 'assistant', content: VARIANTS[selected] }} showAvatar={false} />
            <div className="pl-12">
              <Branch count={VARIANTS.length} selected={selected} onSelect={setSelected} />
            </div>
          </div>
        }
        code={`import { Branch } from '@slipstream-ui/ai';

const [selected, setSelected] = useState(0);

<Branch
  count={variants.length}
  selected={selected}
  onSelect={setSelected}
/>`}
      />
    </ComponentPage>
  );
}
