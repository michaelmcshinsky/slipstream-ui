'use client';

import { useState } from 'react';
import { Branch, Message } from '@slipstream-ui/ai';
import { DemoCard } from '@/components/demo-card';

const VARIANTS = [
  'The capital of France is Paris.',
  "It's Paris: home to roughly two million people.",
  'Paris is the capital and largest city of France.',
];

export default function Demo() {
  const [selected, setSelected] = useState(0);

  return (
    <>
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
    </>
  );
}
