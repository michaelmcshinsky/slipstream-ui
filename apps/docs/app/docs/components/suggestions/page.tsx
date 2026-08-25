'use client';

import { Suggestions } from '@slipstream-ui/ai';
import { CodeBlock } from '@/components/code-block';

export default function SuggestionsPage() {
  return <div><h1 className="text-4xl font-bold mb-4">Suggestions</h1><p className="text-lg text-muted-foreground mb-8">Offer useful next prompts after an AI response.</p><div className="rounded-lg border border-border p-6 mb-8"><Suggestions suggestions={[{ id: '1', text: 'Summarize this in three bullets', type: 'follow-up' }, { id: '2', text: 'Show me an example', type: 'action' }]} onSelect={(suggestion) => console.log(suggestion.text)} /></div><CodeBlock>{`<Suggestions\n  suggestions={[{ id: '1', text: 'Show me an example' }]}\n  onSelect={(suggestion) => setPrompt(suggestion.text)}\n/>`}</CodeBlock></div>;
}
