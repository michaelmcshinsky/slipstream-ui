'use client';

import { useState } from 'react';
import { Suggestions } from '@slipstream-ui/ai';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <>
      <DemoCard
        title="Follow-up prompts"
        preview={
          <div className="w-full space-y-3">
            <Suggestions
              suggestions={[
                { id: '1', text: 'Summarize this in three bullets', type: 'follow-up' },
                { id: '2', text: 'Show me an example', type: 'action' },
              ]}
              onSelect={(suggestion) => setSelected(suggestion.text)}
            />
            <p className="text-xs text-muted-foreground">Selected: {selected ?? 'none'}</p>
          </div>
        }
        code={`<Suggestions
  suggestions={[{ id: '1', text: 'Show me an example' }]}
  onSelect={(suggestion) => setPrompt(suggestion.text)}
/>`}
      />
      <DemoCard
        title="Overflow with maxDisplay"
        preview={
          <div className="w-full space-y-3">
            <Suggestions
              maxDisplay={2}
              suggestions={[
                { id: '1', text: 'Explain the pricing model', type: 'follow-up' },
                { id: '2', text: 'Compare plans side by side', type: 'action' },
                { id: '3', text: 'Show enterprise options', type: 'query' },
                { id: '4', text: 'Book a demo', type: 'action' },
              ]}
              onSelect={(suggestion) => setSelected(suggestion.text)}
            />
            <p className="text-xs text-muted-foreground">Selected: {selected ?? 'none'}</p>
          </div>
        }
        code={`<Suggestions
  maxDisplay={2}
  suggestions={suggestions}
  onSelect={(suggestion) => setPrompt(suggestion.text)}
/>`}
        usage={`// maxDisplay caps the visible chips and shows a "+N more" indicator;
// 0 or undefined renders every suggestion.`}
      />
    </>
  );
}
