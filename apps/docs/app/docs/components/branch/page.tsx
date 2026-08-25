'use client';

import { useState } from 'react';
import { Branch, Message } from '@slipstream-ui/ai';
import { PropsTable } from '@/components/props-table';

const VARIANTS = [
  'The capital of France is Paris.',
  "It's Paris — home to roughly two million people.",
  'Paris is the capital and largest city of France.',
];

export default function BranchPage() {
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Branch</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Variant navigation for branched messages: ‹ N / M › controls that let users compare
        alternative AI responses. Purely presentational — you swap the content.
      </p>

      <h2 className="text-sm font-semibold mb-4">Live preview</h2>
      <div className="rounded-lg border border-border p-6 mb-8 max-w-xl space-y-3">
        <Message message={{ id: 'v', role: 'assistant', content: VARIANTS[selected] }} showAvatar={false} />
        <div className="pl-12">
          <Branch count={VARIANTS.length} selected={selected} onSelect={setSelected} />
        </div>
      </div>

      <PropsTable
        rows={[
          { name: 'count', type: 'number', description: 'Total variants; renders nothing below 2.' },
          { name: 'selected', type: 'number', description: 'Controlled zero-based index.' },
          { name: 'defaultSelected', type: 'number', defaultValue: '0', description: 'Uncontrolled initial index.' },
          { name: 'onSelect', type: '(index: number) => void', description: 'Called with the chosen variant index.' },
          { name: 'labels', type: 'object', description: 'Overrides for previous/next aria-labels.' },
        ]}
      />

      <h2 className="text-2xl font-semibold mt-10 mb-4">Accessibility</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>Arrows disable at the ends instead of wrapping silently.</li>
        <li>Position indicator uses <code className="bg-muted px-1 rounded">aria-live=polite</code>.</li>
      </ul>
    </div>
  );
}
