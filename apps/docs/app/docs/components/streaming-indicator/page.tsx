import { StreamingIndicator } from '@slipstream-ui/ai';

export default function StreamingIndicatorPage() {
  return <div><h1 className="text-4xl font-bold mb-4">StreamingIndicator</h1><p className="text-lg text-muted-foreground mb-8">Give immediate feedback while an assistant response is arriving.</p><div className="rounded-lg border border-border p-6 mb-8"><StreamingIndicator isStreaming text="Writing a response…" /></div><pre className="bg-muted p-4 rounded text-sm overflow-x-auto"><code>{`<StreamingIndicator isStreaming={isGenerating} text="Writing a response…" />`}</code></pre></div>;
}
