import { InlineCitation, Message } from '@slipstream-ui/ai';
import { PropsTable } from '@/components/props-table';

const source = {
  id: 'src-1',
  title: 'State of AI 2026',
  url: 'https://example.com/state-of-ai',
  snippet: '78% of enterprises shipped at least one LLM-powered feature in production.',
};

export default function InlineCitationPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">InlineCitation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Perplexity-style inline citation: a superscript chip that reveals the source title and
        snippet on hover or keyboard focus. Use it to attribute individual claims inside a
        response; use <code className="bg-muted px-1 rounded">Sources</code> for the footer list.
      </p>

      <h2 className="text-sm font-semibold mb-4">Live preview (hover or focus the chip)</h2>
      <div className="rounded-lg border border-border p-6 mb-8 max-w-xl">
        <Message showAvatar={false} message={{
          id: 'demo',
          role: 'assistant',
          content: 'Placeholder — content rendered below.',
        }} />
        <div className="pl-12 text-sm">
          Most enterprises now run LLM features in production{' '}
          <InlineCitation source={source}>according to industry surveys</InlineCitation>.
        </div>
      </div>

      <PropsTable
        rows={[
          { name: 'source', type: 'SourceItem', description: 'Cited source powering the preview card.' },
          { name: 'children', type: 'ReactNode', description: 'Wrapped text; defaults to the source title.' },
        ]}
      />

      <h2 className="text-2xl font-semibold mt-10 mb-4">Accessibility</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>Trigger is a focusable button; the card opens via focus-within.</li>
        <li>Card has <code className="bg-muted px-1 rounded">role=tooltip</code> linked by aria-describedby.</li>
        <li>Keep inline citations one-per-claim; long lists belong in Sources.</li>
      </ul>
    </div>
  );
}
