import { StreamingIndicator } from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function StreamingIndicatorPage() {
  return (
    <ComponentPage
      id="streaming-indicator"
      title="StreamingIndicator"
      description="Give immediate feedback while an assistant response is arriving."
    >
      <DemoCard
        title="Streaming state"
        preview={<StreamingIndicator isStreaming text="Writing a response…" />}
        code={`<StreamingIndicator isStreaming={isGenerating} text="Writing a response…" />`}
      />
    </ComponentPage>
  );
}
