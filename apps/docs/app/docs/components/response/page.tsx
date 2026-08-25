import { CodeBlock, Response } from '@slipstream-ui/ai';
import { PropsTable } from '@/components/props-table';

const SAMPLE = `# Quarterly summary

Revenue grew **34%** quarter-over-quarter.

| Region | Q1 | Q2 |
|--------|----|----|
| EMEA   | 12 | 16 |

- Ship streaming renderer
- ~~Remove legacy API~~ done

\`\`\`ts
export const answer = 42;
\`\`\``;

export default function ResponsePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Response</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Streaming-optimized markdown renderer for AI responses: GitHub-flavored markdown,
        automatic repair of incomplete syntax while tokens arrive, and code blocks routed
        through <code className="bg-muted px-1 rounded">CodeBlock</code>.
      </p>

      <h2 className="text-sm font-semibold mb-4">Live preview</h2>
      <div className="rounded-lg border border-border p-6 mb-4">
        <Response>{SAMPLE}</Response>
      </div>

      <h2 className="text-sm font-semibold mb-4">Streaming simulation (partial content)</h2>
      <div className="rounded-lg border border-border p-6 mb-8">
        <Response>{'Rendering partial tokens with an unclosed **bold marker and `inline cod'}</Response>
      </div>

      <PropsTable
        rows={[
          { name: 'children', type: 'string', description: 'Markdown content to render.' },
          { name: 'parseIncompleteMarkdown', type: 'boolean', defaultValue: 'true', description: 'Close unclosed emphasis/inline-code/fences during streaming.' },
        ]}
      />

      <h2 className="text-2xl font-semibold mt-10 mb-4">Usage</h2>
      <CodeBlock language="tsx" code={`import { Response } from '@slipstream-ui/ai';

// Static content
<Response>{assistantMessage.content}</Response>

// Pair with Message for the full pattern
<Message message={message} renderContent={(c) => <Response>{c}</Response>} />`} />

      <h2 className="text-2xl font-semibold mt-10 mb-4">Accessibility</h2>
      <ul className="list-disc pl-5 space-y-2 text-sm">
        <li>Headings, lists, and tables render as real semantic elements.</li>
        <li>Code blocks use the accessible CodeBlock copy control.</li>
      </ul>
    </div>
  );
}
