import { InlineCitation } from '@slipstream-ui/ai';
import { DemoCard } from '@/components/demo-card';

const source = {
  id: 'src-1',
  title: 'State of AI 2026',
  url: 'https://example.com/state-of-ai',
  snippet: '78% of enterprises shipped at least one LLM-powered feature in production.',
};

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Hover or focus the chip"
        preview={
          <div className="w-full max-w-xl rounded-lg border border-border bg-card p-4 text-sm">
            <p>
              Most enterprises now run LLM features in production{' '}
              <InlineCitation source={source}>according to industry surveys</InlineCitation>.
            </p>
          </div>
        }
        code={`import { InlineCitation } from '@slipstream-ui/ai';

<p>
  Most enterprises now run LLM features in production{' '}
  <InlineCitation source={source}>
    according to industry surveys
  </InlineCitation>.
</p>`}
        usage={`// Drop the chip inside the sentence it supports — it renders as a
// superscript button, so it composes with plain text and markdown output.`}
      />
    </>
  );
}
