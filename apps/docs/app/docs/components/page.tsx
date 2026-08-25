import Link from 'next/link';

export default function ComponentsOverviewPage() {
  const coreComponents = [
    { name: 'Button', id: 'button', tier: 'atom', description: 'Clickable button with variants' },
    { name: 'Input', id: 'input', tier: 'atom', description: 'Text input with HTML input support' },
    { name: 'Badge', id: 'badge', tier: 'atom', description: 'Status indicator for tags and counts' },
    { name: 'Avatar', id: 'avatar', tier: 'atom', description: 'User profile image with fallback' },
    { name: 'Spinner', id: 'spinner', tier: 'atom', description: 'Accessible loading indicator' },
  ];

  const aiComponents = [
    { name: 'Message', id: 'message', tier: 'molecule', description: 'Chat message with role styling, streaming, and custom rendering' },
    { name: 'Conversation', id: 'conversation', tier: 'organism', description: 'Message list with auto-scroll' },
    { name: 'PromptInput', id: 'prompt-input', tier: 'molecule', description: 'Chat input with auto-resize and stop-generation' },
    { name: 'Reasoning', id: 'reasoning', tier: 'molecule', description: 'AI reasoning steps display' },
    { name: 'ToolCall', id: 'tool-call', tier: 'molecule', description: 'Tool call status and results' },
    { name: 'Sources', id: 'sources', tier: 'molecule', description: 'Citations and references for AI responses' },
    { name: 'Suggestions', id: 'suggestions', tier: 'molecule', description: 'Clickable follow-up prompts' },
    { name: 'ChainThought', id: 'chain-thought', tier: 'molecule', description: 'Ordered agent reasoning steps' },
    { name: 'StreamingIndicator', id: 'streaming-indicator', tier: 'atom', description: 'Streaming and generating state' },
    { name: 'Attachment', id: 'attachment', tier: 'molecule', description: 'File chips with upload status and remove actions' },
    { name: 'MessageActions', id: 'message-actions', tier: 'atom', description: 'Copy, feedback ratings, and regenerate toolbar' },
  ];

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Components</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Explore all available Slipstream UI components with their documentation and examples.
      </p>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Core Components</h2>
          <p className="text-muted-foreground mb-6">
            Base UI components (atoms and molecules) from <code className="bg-muted px-2 py-1 rounded">@slipstream-ui/core</code>
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {coreComponents.map((component) => (
              <Link
                key={component.id}
                href={`/docs/components/${component.id}`}
                className="block p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{component.name}</h3>
                  <span className="text-xs bg-muted px-2 py-1 rounded">{component.tier}</span>
                </div>
                <p className="text-sm text-muted-foreground">{component.description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">AI Components</h2>
          <p className="text-muted-foreground mb-6">
            AI interaction components from <code className="bg-muted px-2 py-1 rounded">@slipstream-ui/ai</code>
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {aiComponents.map((component) => (
              <Link
                key={component.id}
                href={`/docs/components/${component.id}`}
                className="block p-4 border rounded-lg hover:border-primary transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{component.name}</h3>
                  <span className="text-xs bg-muted px-2 py-1 rounded">{component.tier}</span>
                </div>
                <p className="text-sm text-muted-foreground">{component.description}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
