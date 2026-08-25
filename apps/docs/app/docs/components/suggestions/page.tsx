'use client';

import { Suggestions } from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function SuggestionsPage() {
  return (
    <ComponentPage
      id="suggestions"
      title="Suggestions"
      description="Offer useful next prompts after an AI response."
    >
      <DemoCard
        title="Follow-up prompts"
        preview={
          <Suggestions
            suggestions={[
              { id: '1', text: 'Summarize this in three bullets', type: 'follow-up' },
              { id: '2', text: 'Show me an example', type: 'action' },
            ]}
            onSelect={(suggestion) => console.log(suggestion.text)}
          />
        }
        code={`<Suggestions
  suggestions={[{ id: '1', text: 'Show me an example' }]}
  onSelect={(suggestion) => setPrompt(suggestion.text)}
/>`}
      />
    </ComponentPage>
  );
}
