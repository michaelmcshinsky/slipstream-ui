import { ChainThought } from '@slipstream-ui/ai';
import { CodeBlock } from '@/components/code-block';

export default function ChainThoughtPage() {
  return <div><h1 className="text-4xl font-bold mb-4">ChainThought</h1><p className="text-lg text-muted-foreground mb-8">Show ordered agent work with explicit progress status.</p><div className="rounded-lg border border-border p-6 mb-8"><ChainThought steps={[{ id: '1', content: 'Find relevant context', status: 'completed' }, { id: '2', content: 'Call the knowledge tool', status: 'completed' }, { id: '3', content: 'Write the response', status: 'pending' }]} /></div><CodeBlock>{`<ChainThought\n  steps={[\n    { id: '1', content: 'Find context', status: 'completed' },\n    { id: '2', content: 'Write response', status: 'pending' },\n  ]}\n/>`}</CodeBlock></div>;
}
