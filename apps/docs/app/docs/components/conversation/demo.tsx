'use client';

import { useState } from 'react';
import { Conversation } from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

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
    <ComponentPage
      id="conversation"
      title="Conversation"
      description="A container for displaying a list of chat messages with auto-scroll and loading states."
      propsRows={[
        { name: 'messages', type: 'Message[]', defaultValue: 'required', description: 'Array of message objects to display' },
        { name: 'isLoading', type: 'boolean', defaultValue: 'false', description: 'Whether assistant is generating a response' },
        { name: 'showAvatars', type: 'boolean', defaultValue: 'true', description: 'Whether to show avatars for messages' },
        { name: 'loadingMessage', type: 'string', defaultValue: "'Thinking...'", description: 'Text to display while loading' },
        { name: 'renderContent', type: '(content: string) => ReactNode', defaultValue: 'undefined', description: 'Custom renderer applied to every message (e.g. markdown)' },
        { name: 'streamingMessageId', type: 'string', defaultValue: 'undefined', description: 'ID of the message still generating; shows its cursor and auto-scrolls' },
      ]}
      accessibility={[
        "Auto-scroll behavior is smooth and doesn't interrupt users",
        'Loading state is visually indicated',
        'Consider adding aria-live regions for streaming responses',
        'Ensure users can navigate through messages with keyboard if needed',
      ]}
    >
      <DemoCard
        title="Playground"
        preview={
          <div className="w-full space-y-4">
            <div className="h-96 border rounded-lg overflow-hidden">
              <Conversation
                messages={messages}
                isLoading={isLoading}
                showAvatars={showAvatars}
                loadingMessage="Thinking..."
              />
            </div>
            <div className="space-y-4">
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
        }
        code={`import { Conversation } from '@slipstream-ui/ai';

const [messages, setMessages] = useState([
  { id: '1', role: 'user', content: 'Hello!' },
  { id: '2', role: 'assistant', content: 'Hi there!' }
])

<Conversation
  messages={messages}
  isLoading={isGenerating}
  showAvatars={true}
  userAvatarFallback="You"
  assistantAvatarFallback="AI"
/>`}
      />
      <DemoCard
        title="With loading state"
        preview={
          <div className="h-64 w-full border rounded-lg overflow-hidden">
            <Conversation messages={messages} isLoading={true} />
          </div>
        }
        code={`<Conversation messages={messages} isLoading={true} loadingMessage="Thinking..." />`}
      />
    </ComponentPage>
  );
}
