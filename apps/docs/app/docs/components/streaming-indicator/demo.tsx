import { StreamingIndicator } from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function StreamingIndicatorPage() {
  return (
    <ComponentPage
      id="streaming-indicator"
      title="StreamingIndicator"
      description="Give immediate feedback while an assistant response is arriving."
      npmPackages="@slipstream-ui/ai"
      propsRows={[
        { name: 'isStreaming', type: 'boolean', defaultValue: 'required', description: 'Render the indicator only while a response is arriving' },
        { name: 'text', type: 'string', defaultValue: "'Generating...'", description: 'Label rendered beside the dots and used as the accessible name' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Dot and label scale' },
        { name: 'tone', type: "'primary' | 'muted' | 'current'", defaultValue: "'primary'", description: 'Dot colour: brand primary, muted foreground, or the inherited text colour' },
        { name: 'dotCount', type: 'number', defaultValue: '3', description: 'How many dots pulse' },
        { name: 'showLabel', type: 'boolean', defaultValue: 'true', description: 'Hide the label visually; the text stays the accessible name' },
      ]}
      accessibility={[
        'role="status" with aria-live="polite" announces generation once.',
        'The dots are decorative; the text is the accessible name.',
        'Pulse animation is suppressed under prefers-reduced-motion.',
      ]}
    >
      <DemoCard
        title="Streaming state"
        preview={<StreamingIndicator isStreaming text="Writing a response." />}
        code={`<StreamingIndicator isStreaming={isGenerating} text="Writing a response." />`}
      />

      <DemoCard
        title="Sizes, tones and dot counts"
        preview={
          <div className="space-y-4">
            <StreamingIndicator isStreaming size="sm" tone="muted" text="Small, muted" />
            <StreamingIndicator isStreaming text="Default" />
            <StreamingIndicator isStreaming size="lg" dotCount={5} text="Large, five dots" />
            <StreamingIndicator isStreaming tone="current" showLabel={false} text="Dots only" />
          </div>
        }
        code={`<StreamingIndicator isStreaming size="sm" tone="muted" />
<StreamingIndicator isStreaming />
<StreamingIndicator isStreaming size="lg" dotCount={5} />
<StreamingIndicator isStreaming showLabel={false} />`}
        usage={`// Match the indicator to the surrounding chat row: 'current' inherits the
// text colour inside a tinted bubble, 'muted' recedes in a toolbar.
// showLabel={false} keeps the status text for screen readers only.`}
      />
    </ComponentPage>
  );
}
