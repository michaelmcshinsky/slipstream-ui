import { useState } from 'react';
import { Button, Input, Badge, Avatar, AvatarFallback, Spinner } from '@slipstream-ui/core';
import { Conversation, PromptInput, Reasoning, ToolCall, Sources, Suggestions, ChainThought, StreamingIndicator, AttachmentList, MessageActions, Message } from '@slipstream-ui/ai';
import { defaultTheme, violetTheme } from '@slipstream-ui/themes';

function App() {
  const [messages, setMessages] = useState([
    { id: '1', role: 'user' as const, content: 'Hello! Welcome to Slipstream UI Playground.' },
    { id: '2', role: 'assistant' as const, content: 'Hi there! This is a demo of the Slipstream UI components. Try adding a message!' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [themeName, setThemeName] = useState('default');

  const changeTheme = (name: string) => {
    const theme = name === 'violet' ? violetTheme : defaultTheme;
    // Apply the structured token map directly; no CSS-string round-trip.
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value ?? '');
    });
    document.documentElement.style.setProperty('--radius', theme.borderRadius ?? '');
    setThemeName(name);
  };

  const handleSubmit = (value: string) => {
    const userMessage = { id: Date.now().toString(), role: 'user' as const, content: value };
    // Updater form avoids a stale `messages` closure.
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    setTimeout(() => {
      const id = (Date.now() + 1).toString();
      const assistantMessage = {
        id,
        role: 'assistant' as const,
        content: `I received your message: "${value}". This simulated response streams token by token to demonstrate the streaming cursor.`
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      // Simulate token-by-token streaming
      setStreamingId(id);
      const fullText = assistantMessage.content;
      let cursor = 0;
      const streamTimer = setInterval(() => {
        cursor += 12;
        if (cursor >= fullText.length) {
          clearInterval(streamTimer);
          setStreamingId(null);
          setMessages(prev => prev.map((m) => (m.id === id ? { ...m, content: fullText } : m)));
        } else {
          const partial = fullText.slice(0, cursor);
          setMessages(prev => prev.map((m) => (m.id === id ? { ...m, content: partial } : m)));
        }
      }, 40);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div><h1 className="text-4xl font-bold mb-2">Slipstream UI Playground</h1><p className="text-muted-foreground">Interactive demo of Slipstream UI components</p></div>
            <label className="text-sm text-muted-foreground">Theme <select value={themeName} onChange={(event) => changeTheme(event.target.value)} className="ml-2 rounded border border-border bg-background px-2 py-1 text-foreground"><option value="default">Default blue</option><option value="violet">Violet</option></select></label>
          </div>
        </header>

        <div className="space-y-8">
          {/* Button Demo */}
          <section className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Button Component</h2>
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">→</Button>
              <Button disabled>Disabled</Button>
            </div>
          </section>

          <section className="p-6 border rounded-lg bg-card space-y-5">
            <h2 className="text-xl font-semibold">AI Response Support</h2>
            <StreamingIndicator isStreaming={isLoading} text="Streaming response…" />
            <ChainThought steps={[{ id: '1', content: 'Classify the request', status: 'completed' }, { id: '2', content: 'Draft an answer', status: isLoading ? 'pending' : 'completed' }]} />
            <Sources sources={[{ id: '1', title: 'Slipstream UI docs', url: '/docs', snippet: 'AI-first components with machine-readable manifests.' }, { id: '2', title: 'React', url: 'https://react.dev' }]} />
            <Suggestions suggestions={[{ id: '1', text: 'Show me an example', type: 'follow-up' }, { id: '2', text: 'Summarize this response', type: 'action' }]} onSelect={(suggestion) => setMessages((current) => [...current, { id: Date.now().toString(), role: 'user' as const, content: suggestion.text }])} />
          </section>

          {/* Chat Demo */}
          <section className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">AI Components Demo</h2>
            <div className="h-96 border rounded-lg overflow-hidden mb-4">
              <Conversation
                messages={messages}
                isLoading={isLoading}
                showAvatars={true}
                loadingMessage="Thinking..."
                streamingMessageId={streamingId ?? undefined}
              />
            </div>
            <PromptInput
              onSubmit={handleSubmit}
              placeholder="Type a message to test the chat..."
              onStop={() => setStreamingId(null)}
              isLoading={isLoading || streamingId !== null}
            />
          </section>

          {/* Badge Demo */}
          <section className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Badge Component</h2>
            <div className="flex flex-wrap gap-4">
              <Badge>New</Badge>
              <Badge variant="secondary">Info</Badge>
              <Badge variant="destructive">Error</Badge>
              <Badge variant="outline">Beta</Badge>
              <Badge>3</Badge>
              <Badge variant="outline">Active</Badge>
            </div>
          </section>

          {/* Input Demo */}
          <section className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Input Component</h2>
            <div className="space-y-4 max-w-md">
              <Input placeholder="Default input" />
              <Input type="email" placeholder="Email input" />
              <Input type="password" placeholder="Password input" />
              <Input disabled placeholder="Disabled input" />
            </div>
          </section>

          {/* Avatar Demo */}
          <section className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Avatar Component</h2>
            <div className="flex flex-wrap gap-4 items-center">
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
              </Avatar>
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-secondary text-secondary-foreground">U</AvatarFallback>
              </Avatar>
            </div>
          </section>

          {/* Reasoning Demo */}
          <section className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Reasoning Component</h2>
            <Reasoning 
              steps={[
                { id: '1', content: 'Analyzing the user request...' },
                { id: '2', content: 'Considering different approaches...' },
                { id: '3', content: 'Formulating the response...' }
              ]}
            />
          </section>

          {/* ToolCall Demo */}
          <section className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">ToolCall Component</h2>
            <ToolCall
              toolCall={{
                id: 'tool-1',
                name: 'search_database',
                arguments: { query: 'React components' },
                status: 'completed',
                result: { results: ['Component A', 'Component B'] }
              }}
            />
          </section>

          {/* Spinner Demo */}
          <section className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Spinner Component</h2>
            <div className="flex flex-wrap items-center gap-6">
              <Spinner size="sm" />
              <Spinner />
              <Spinner size="lg" />
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner size="sm" aria-hidden label="" /> Generating response...
              </span>
            </div>
          </section>

          {/* Attachment Demo */}
          <section className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Attachment Component</h2>
            <AttachmentList
              attachments={[
                { id: '1', name: 'product-spec.pdf', size: '2.4 MB', type: 'PDF', status: 'done' },
                { id: '2', name: 'screenshot.png', size: '480 KB', status: 'done' },
                { id: '3', name: 'dataset.csv', status: 'uploading' },
              ]}
              onRemove={(attachment) => window.alert(`Removing ${attachment.name}`)}
            />
          </section>

          {/* MessageActions + streaming Message demo */}
          <section className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Message & MessageActions Components</h2>
            <Message
              message={{
                id: 'demo',
                role: 'assistant',
                content: 'Stateless components with callbacks — copy, rate, or regenerate this response.',
              }}
            />
            <div className="pl-12">
              <MessageActions
                content="Stateless components with callbacks — copy, rate, or regenerate this response."
                onFeedback={(rating) => window.alert(`Feedback: ${rating ?? 'cleared'}`)}
                onRegenerate={() => window.alert('Regenerating...')}
              />
            </div>
          </section>
        </div>

        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>Built with Slipstream UI • AI-first React component library</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
