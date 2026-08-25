'use client';

import { useState } from 'react';
import { Message } from '@slipstream-ui/ai';

export default function MessagePage() {
  const [role, setRole] = useState<'user' | 'assistant' | 'system'>('user');
  const [showAvatar, setShowAvatar] = useState(true);

  const sampleMessages = {
    user: { id: '1', role: 'user' as const, content: 'Hello, how are you today?' },
    assistant: { id: '2', role: 'assistant' as const, content: 'I\'m doing well, thank you for asking! How can I help you today?' },
    system: { id: '3', role: 'system' as const, content: 'System initialized and ready.' },
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-2">Message</h1>
      <p className="text-lg text-muted-foreground mb-8">
        A chat message component that displays messages from users, assistants, or system prompts with optional avatars.
      </p>

      {/* Live Preview */}
      <div className="mb-8 p-6 border rounded-lg bg-card">
        <h2 className="text-sm font-semibold mb-4">Live Preview</h2>
        <div className="space-y-4">
          <Message 
            message={sampleMessages[role]} 
            showAvatar={showAvatar}
          />
        </div>
        <div className="space-y-4 mt-4">
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

      {/* Installation */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Installation</h2>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
          <code>npx slipstream-ui add message</code>
        </pre>
        <p className="text-sm text-muted-foreground mt-2">Or import manually:</p>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto mt-2">
          <code>{`import { Message } from '@slipstream-ui/ai'`}</code>
        </pre>
      </div>

      {/* Usage */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Usage</h2>
        <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
          <code>{`<Message 
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
                <td className="p-3 font-mono text-xs">message</td>
                <td className="p-3 text-xs">Message</td>
                <td className="p-3 text-xs">required</td>
                <td className="p-3 text-xs">The message object with role, content, and metadata</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">showAvatar</td>
                <td className="p-3 text-xs">boolean</td>
                <td className="p-3 text-xs">true</td>
                <td className="p-3 text-xs">Whether to show the avatar</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">avatarSrc</td>
                <td className="p-3 text-xs">string</td>
                <td className="p-3 text-xs">undefined</td>
                <td className="p-3 text-xs">Custom avatar image URL</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">avatarFallback</td>
                <td className="p-3 text-xs">string</td>
                <td className="p-3 text-xs">undefined</td>
                <td className="p-3 text-xs">Fallback text for avatar</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">userLabel</td>
                <td className="p-3 text-xs">string</td>
                <td className="p-3 text-xs">&apos;You&apos;</td>
                <td className="p-3 text-xs">Display name for user messages (localization)</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">assistantLabel</td>
                <td className="p-3 text-xs">string</td>
                <td className="p-3 text-xs">&apos;Assistant&apos;</td>
                <td className="p-3 text-xs">Display name for assistant messages (localization)</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">renderContent</td>
                <td className="p-3 text-xs">(content: string) =&gt; ReactNode</td>
                <td className="p-3 text-xs">undefined</td>
                <td className="p-3 text-xs">Custom content renderer (e.g. markdown); replaces plain-text rendering</td>
              </tr>
              <tr className="border-t">
                <td className="p-3 font-mono text-xs">isStreaming</td>
                <td className="p-3 text-xs">boolean</td>
                <td className="p-3 text-xs">false</td>
                <td className="p-3 text-xs">Shows a typing cursor and sets aria-busy while generating</td>
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
            <h3 className="font-medium mb-2">User message</h3>
            <Message message={{ id: '1', role: 'user', content: 'Hello, how are you?' }} />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Assistant message</h3>
            <Message message={{ id: '2', role: 'assistant', content: 'I\'m doing well, thank you!' }} />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">System message</h3>
            <Message message={{ id: '3', role: 'system', content: 'System initialized' }} />
          </div>
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-2">Streaming response</h3>
            <Message
              message={{ id: '4', role: 'assistant', content: 'Generating a response token by tok' }}
              isStreaming
            />
          </div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Accessibility</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Message role and content are announced by screen readers</li>
          <li>Avatar has proper alt text from fallback or role</li>
          <li>System messages have distinct visual styling</li>
          <li>Timestamps are properly formatted for accessibility</li>
        </ul>
      </div>
    </div>
  );
}
