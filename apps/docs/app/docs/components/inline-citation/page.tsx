import { InlineCitation, Message } from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

const source = {
  id: 'src-1',
  title: 'State of AI 2026',
  url: 'https://example.com/state-of-ai',
  snippet: '78% of enterprises shipped at least one LLM-powered feature in production.',
};

export default function InlineCitationPage() {
  return (
    <ComponentPage
      id="inline-citation"
      title="InlineCitation"
      description="Perplexity-style inline citation: a superscript chip that reveals the source title and snippet on hover or keyboard focus. Use it to attribute individual claims inside a response; use Sources for the footer list."
      propsRows={[
        { name: 'source', type: 'SourceItem', description: 'Cited source powering the preview card.' },
        { name: 'children', type: 'ReactNode', description: 'Wrapped text; defaults to the source title.' },
      ]}
      accessibility={[
        'Trigger is a focusable button; the card opens via focus-within.',
        'Card has role=tooltip linked by aria-describedby.',
        'Keep inline citations one-per-claim; long lists belong in Sources.',
      ]}
    >
      <DemoCard
        title="Hover or focus the chip"
        preview={
          <div className="w-full max-w-xl">
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
        }
        code={`import { InlineCitation } from '@slipstream-ui/ai';

<InlineCitation source={source}>
  according to industry surveys
</InlineCitation>`}
      />
    </ComponentPage>
  );
}
