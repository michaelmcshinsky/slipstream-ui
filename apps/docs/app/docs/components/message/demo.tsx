'use client';

import { useState } from 'react';
import { Message } from '@slipstream-ui/ai';
import { Checkbox, Label, Select } from '@slipstream-ui/core';
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
        { name: 'density', type: "'comfortable' | 'compact' | 'tight'", defaultValue: "'comfortable'", description: 'Padding and gap scale for the bubble' },
        { name: 'surface', type: "'auto' | 'none' | 'card' | 'muted' | 'primary'", defaultValue: "'auto'", description: 'Bubble surface; auto keeps the role tint, none is transparent' },
        { name: 'renderContent', type: '(content: string) => ReactNode', defaultValue: 'undefined', description: 'Custom content renderer (e.g. markdown); replaces plain-text rendering' },
        { name: 'isStreaming', type: 'boolean', defaultValue: 'false', description: 'Shows a typing cursor and sets aria-busy while generating' },
        { name: 'error', type: 'string', description: 'Generation failure text; renders an error card in place of content.' },
        { name: 'onRetry', type: '() => void', description: 'Called when the user requests a retry after error; omit to hide the action.' },
        { name: 'onEditContent', type: '(content: string) => void', description: 'Edit-and-resubmit affordance for user messages.' },
        { name: 'labels', type: '{ retry?, edit?, save?, cancel? }', description: 'Localized action labels.' },
        { name: 'formatTime', type: '(date: Date) => string', description: 'Custom timestamp formatter.' },
        { name: 'locale', type: 'string', description: 'BCP-47 locale for the default timestamp formatter.' },
        { name: 'className', type: 'string', description: 'Extra classes for the root element.' },
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
                <Select
                  aria-label="Message role"
                  value={role}
                  onValueChange={(value) => setRole(value as 'user' | 'assistant' | 'system')}
                  options={[
                    { value: 'user', label: 'User' },
                    { value: 'assistant', label: 'Assistant' },
                    { value: 'system', label: 'System' },
                  ]}
                />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="showAvatar"
                  checked={showAvatar}
                  onCheckedChange={setShowAvatar}
                />
                <Label htmlFor="showAvatar" className="text-sm">Show Avatar</Label>
              </div>
            </div>
          </div>
        }
        code={`import { Message } from '@slipstream-ui/ai';
import { Checkbox, Label, Select } from '@slipstream-ui/core';

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
