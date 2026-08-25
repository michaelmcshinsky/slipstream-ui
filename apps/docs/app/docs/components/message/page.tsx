'use client';

import { useState } from 'react';
import { Message } from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function MessagePage() {
  const [role, setRole] = useState<'user' | 'assistant' | 'system'>('user');
  const [showAvatar, setShowAvatar] = useState(true);

  const sampleMessages = {
    user: { id: '1', role: 'user' as const, content: 'Hello, how are you today?' },
    assistant: { id: '2', role: 'assistant' as const, content: 'I\'m doing well, thank you for asking! How can I help you today?' },
    system: { id: '3', role: 'system' as const, content: 'System initialized and ready.' },
  };

  return (
    <ComponentPage
      id="message"
      title="Message"
      description="A chat message component that displays messages from users, assistants, or system prompts with optional avatars."
      propsRows={[
        { name: 'message', type: 'Message', defaultValue: 'required', description: 'The message object with role, content, and metadata' },
        { name: 'showAvatar', type: 'boolean', defaultValue: 'true', description: 'Whether to show the avatar' },
        { name: 'avatarSrc', type: 'string', defaultValue: 'undefined', description: 'Custom avatar image URL' },
        { name: 'avatarFallback', type: 'string', defaultValue: 'undefined', description: 'Fallback text for avatar' },
        { name: 'userLabel', type: 'string', defaultValue: "'You'", description: 'Display name for user messages (localization)' },
        { name: 'assistantLabel', type: 'string', defaultValue: "'Assistant'", description: 'Display name for assistant messages (localization)' },
        { name: 'renderContent', type: '(content: string) => ReactNode', defaultValue: 'undefined', description: 'Custom content renderer (e.g. markdown); replaces plain-text rendering' },
        { name: 'isStreaming', type: 'boolean', defaultValue: 'false', description: 'Shows a typing cursor and sets aria-busy while generating' },
      ]}
      accessibility={[
        'Message role and content are announced by screen readers',
        'Avatar has proper alt text from fallback or role',
        'System messages have distinct visual styling',
        'Timestamps are properly formatted for accessibility',
      ]}
    >
      <DemoCard
        title="Playground"
        preview={
          <div className="w-full space-y-4">
            <div className="space-y-4">
              <Message
                message={sampleMessages[role]}
                showAvatar={showAvatar}
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'user' | 'assistant' | 'system')}
                  className="w-full p-2 border rounded bg-background"
                >
                  <option value="user">User</option>
                  <option value="assistant">Assistant</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showAvatar"
                  checked={showAvatar}
                  onChange={(e) => setShowAvatar(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="showAvatar" className="text-sm">Show Avatar</label>
              </div>
            </div>
          </div>
        }
        code={`import { Message } from '@slipstream-ui/ai';

<Message
  message={{
    id: '1',
    role: 'user',
    content: 'Hello!'
  }}
/>
<Message
  message={{
    id: '2',
    role: 'assistant',
    content: 'Hi there!'
  }}
  showAvatar={true}
  avatarFallback="AI"
/>`}
      />
      <DemoCard
        title="Roles & streaming"
        preview={
          <div className="w-full space-y-4">
            <Message message={{ id: '1', role: 'user', content: 'Hello, how are you?' }} />
            <Message message={{ id: '2', role: 'assistant', content: 'I\'m doing well, thank you!' }} />
            <Message message={{ id: '3', role: 'system', content: 'System initialized' }} />
            <Message
              message={{ id: '4', role: 'assistant', content: 'Generating a response token by tok' }}
              isStreaming
            />
          </div>
        }
        code={`<Message message={{ id: '1', role: 'user', content: 'Hello, how are you?' }} />
<Message message={{ id: '2', role: 'assistant', content: "I'm doing well!" }} />
<Message message={{ id: '3', role: 'system', content: 'System initialized' }} />
<Message
  message={{ id: '4', role: 'assistant', content: 'Generating...' }}
  isStreaming
/>`}
      />
    </ComponentPage>
  );
}
