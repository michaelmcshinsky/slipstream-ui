'use client';

import { useState } from 'react';
import { Checkbox } from '@slipstream-ui/core';
import { Conversation } from '@slipstream-ui/ai';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
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
    <>
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
                <Checkbox
                  id="showAvatars"
                  checked={showAvatars}
                  onCheckedChange={setShowAvatars}
                />
                <label htmlFor="showAvatars" className="text-sm">Show Avatars</label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="isLoading"
                  checked={isLoading}
                  onCheckedChange={setIsLoading}
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
  isLoading={isLoading}
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
    </>
  );
}
