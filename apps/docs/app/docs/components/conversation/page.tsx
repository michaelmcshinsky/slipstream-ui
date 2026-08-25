'use client';

import { useState } from 'react';
import { Conversation } from '@slipstream-ui/ai';

export default function ConversationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showAvatars, setShowAvatars] = useState(true);

  const [messages, setMessages] = useState([
    { id: '1', role: 'user' as const, content: 'Hello, can you help me with React?' },
    { id: '2', role: 'assistant' as const, content: 'Of course! I\'d be happy to help you with React. What specific aspect would you like to learn about?' },
    { id: '3', role: 'user' as const, content: 'How do I manage state in React applications?' },
  ]);

  const handleAddMessage = () => {
    const newMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: 'Can you give me an example?',
    };
    setMessages([...messages, newMessage]);
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">Conversation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        A container for displaying a list of chat messages with auto-scroll and loading states.
      </p>

      {/* Live Preview */}
      <div className="mb-8 p-6 border rounded-lg bg-card">
        <h2 className="text-sm font-semibold mb-4">Live Preview</h2>
        <div className="h-96 border rounded-lg overflow-hidden">
          <Conversation 
            messages={messages}
            isLoading={isLoading}
            showAvatars={showAvatars}
            loadingMessage="Thinking..."
          />
        </div>
        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showAvatars"
              checked={showAvatars}
              onChange={(e) => setShowAvatars(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="showAvatars" className="text-sm">Show Avatars</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isLoading"
              checked={isLoading}
              onChange={(e) => setIsLoading(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="isLoading" className="text-sm">Show Loading State</label>
          </div>
          <button
            onClick={handleAddMessage}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Add Message
          </button>
        </div>
      </div>

      {/* Installation */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
          <code>npx slipstream-ui add conversation</code>
        </pre>
        <p className="text-sm text-muted-foreground mt-2">Or import manually:</p>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mt-2">
          <code>{`import { Conversation } from '@slipstream-ui/ai'`}</code>
        </pre>
      </div>

      {/* Usage */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
          <code>{`const [messages, setMessages] = useState([
  { id: '1', role: 'user', content: 'Hello!' },
  { id: '2', role: 'assistant', content: 'Hi there!' }
])

<Conversation 
  messages={messages}
  isLoading={isGenerating}
  showAvatars={true}
  userAvatarFallback="You"
  assistantAvatarFallback="AI"
/>`}</code>
        </pre>
      </div>

      {/* Props */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Props</h2>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted">
              <tr>
                <th className="text-left p-3">Prop</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Default</th>
                <th className="text-left p-3">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">messages</td>
                <td className="p-3 text-xs">Message[]</td>
                <td className="p-3 text-xs">required</td>
                <td className="p-3 text-xs">Array of message objects to display</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">isLoading</td>
                <td className="p-3 text-xs">boolean</td>
                <td className="p-3 text-xs">false</td>
                <td className="p-3 text-xs">Whether assistant is generating a response</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">showAvatars</td>
                <td className="p-3 text-xs">boolean</td>
                <td className="p-3 text-xs">true</td>
                <td className="p-3 text-xs">Whether to show avatars for messages</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">loadingMessage</td>
                <td className="p-3 text-xs">string</td>
                <td className="p-3 text-xs">'Thinking...'</td>
                <td className="p-3 text-xs">Text to display while loading</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">renderContent</td>
                <td className="p-3 text-xs">(content: string) =&gt; ReactNode</td>
                <td className="p-3 text-xs">undefined</td>
                <td className="p-3 text-xs">Custom renderer applied to every message (e.g. markdown)</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">streamingMessageId</td>
                <td className="p-3 text-xs">string</td>
                <td className="p-3 text-xs">undefined</td>
                <td className="p-3 text-xs">ID of the message still generating; shows its cursor and auto-scrolls</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Examples */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Examples</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Basic conversation</h3>
            <div className="h-64 border rounded-lg overflow-hidden">
              <Conversation messages={messages} />
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">With loading state</h3>
            <div className="h-64 border rounded-lg overflow-hidden">
              <Conversation messages={messages} isLoading={true} />
            </div>
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Auto-scroll behavior is smooth and doesn't interrupt users</li>
          <li>Loading state is visually indicated</li>
          <li>Consider adding aria-live regions for streaming responses</li>
          <li>Ensure users can navigate through messages with keyboard if needed</li>
        </ul>
      </div>
    </div>
  );
}
