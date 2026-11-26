'use client';

import { useState } from 'react';
import { Message } from '@slipstream-ui/ai';
import { Checkbox, Label, Select } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  const [role, setRole] = useState<'user' | 'assistant' | 'system'>('user');
  const [showAvatar, setShowAvatar] = useState(true);

  const sampleMessages = {
    user: { id: '1', role: 'user' as const, content: 'Hello, how are you today?' },
    assistant: { id: '2', role: 'assistant' as const, content: 'I\'m doing well, thank you for asking! How can I help you today?' },
    system: { id: '3', role: 'system' as const, content: 'System initialized and ready.' },
  };

  return (
    <>
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
    </>
  );
}
