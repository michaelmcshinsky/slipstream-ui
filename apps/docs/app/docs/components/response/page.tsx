import { Response } from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

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

const PARTIAL = 'Rendering partial tokens with an unclosed **bold marker and `inline cod';

export default function ResponsePage() {
  return (
    <ComponentPage
      id="response"
      title="Response"
      description="Streaming-optimized markdown renderer for AI responses: GitHub-flavored markdown, automatic repair of incomplete syntax while tokens arrive, and code blocks routed through CodeBlock."
      propsRows={[
        { name: 'children', type: 'string', description: 'Markdown content to render.' },
        { name: 'parseIncompleteMarkdown', type: 'boolean', defaultValue: 'true', description: 'Close unclosed emphasis/inline-code/fences during streaming.' },
      ]}
      accessibility={[
        'Headings, lists, and tables render as real semantic elements.',
        'Code blocks use the accessible CodeBlock copy control.',
      ]}
    >
      <DemoCard
        title="Full document"
        preview={<Response>{SAMPLE}</Response>}
        code={`import { Response } from '@slipstream-ui/ai';

// Static content
<Response>{assistantMessage.content}</Response>

// Pair with Message for the full pattern
<Message message={message} renderContent={(c) => <Response>{c}</Response>} />`}
      />
      <DemoCard
        title="Streaming repair (partial content)"
        preview={<Response>{PARTIAL}</Response>}
        code={`// Unclosed markers are repaired while tokens arrive
<Response>{partialContent}</Response>`}
      />
    </ComponentPage>
  );
}
