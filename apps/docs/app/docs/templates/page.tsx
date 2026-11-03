import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { CodeBlock } from '@slipstream-ui/ai';
import { StreamingChatDemo } from '@/components/streaming-chat-demo';
import { AgentDashboardDemo } from '@/components/agent-dashboard-demo';
import { RagCitationsDemo } from '@/components/rag-citations-demo';
import { MultiThreadDemo } from '@/components/multi-thread-demo';
import { SettingsFormDemo } from '@/components/settings-form-demo';

export const metadata: Metadata = {
  title: 'Templates',
  description:
    'Complete, copy-paste Slipstream UI patterns: streaming chat, agent dashboard with human-in-the-loop tool calls, grounded RAG citations, multi-thread conversations, and validated settings forms.',
};

/** Live previews keyed by template index; templates without one show code only. */
const DEMOS: Record<number, ReactNode> = {
  0: <StreamingChatDemo />,
  1: <AgentDashboardDemo />,
  2: <RagCitationsDemo />,
  3: <SettingsFormDemo />,
  4: <MultiThreadDemo />,
};

interface Template {
  name: string;
  description: string;
  features: string[];
  code: string;
}

const templates: Template[] = [
  {
    name: 'Streaming chat',
    description:
      'The core pattern: streaming markdown responses, stop-generation, auto-scroll pinning, and feedback actions. ~80 lines.',
    features: ['Response + Message', 'Stop button', 'Scroll pill', 'MessageActions'],
    code: `'use client';

import { useRef, useState } from 'react';
import {
  Conversation,
  MessageActions,
  PromptInput,
  Response,
} from '@slipstream-ui/ai';
import type { Message } from '@slipstream-ui/ai';

export function StreamingChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  async function send(text: string) {
    const controller = new AbortController();
    abortRef.current = controller;

    // Your transport — any endpoint that streams text chunks.
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ prompt: text }),
      signal: controller.signal,
    });

    const id = crypto.randomUUID();
    setMessages((prev) => [...prev, { id, role: 'assistant', content: '' }]);
    setStreamingId(id);

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let content = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      content += decoder.decode(value, { stream: true });
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, content } : m))
      );
    }
    setStreamingId(null);
  }

  return (
    <div className="flex flex-col h-[600px]">
      <Conversation
        messages={messages}
        streamingMessageId={streamingId ?? undefined}
        renderContent={(content) => <Response parseIncompleteMarkdown>{content}</Response>}
        className="flex-1"
      />
      <div className="pl-12">
        {messages.at(-1)?.role === 'assistant' && (
          <MessageActions
            content={messages.at(-1)!.content}
            onFeedback={(rating) => analytics.track(rating)}
            onRegenerate={() => send('Regenerate')}
          />
        )}
      </div>
      <PromptInput
        onSubmit={send}
        isLoading={streamingId !== null}
        onStop={() => abortRef.current?.abort()}
      />
    </div>
  );
}`,
  },
  {
    name: 'Agent dashboard',
    description:
      'Tool calls with human-in-the-loop approval, reasoning steps, and task progress — the pattern for autonomous agents.',
    features: ['Confirmation gate', 'ToolCall lifecycle', 'Reasoning panel', 'ChainThought'],
    code: `'use client';

import { useState } from 'react';
import {
  ChainThought,
  Confirmation,
  Reasoning,
  ToolCall,
} from '@slipstream-ui/ai';
import type { ToolCall as ToolCallType } from '@slipstream-ui/ai';

export function AgentActivity({ toolCall }: { toolCall: ToolCallType }) {
  const [approved, setApproved] = useState(false);

  return (
    <div className="space-y-4 max-w-xl">
      {/* Pause destructive actions until approved */}
      {toolCall.name === 'delete_files' && !approved ? (
        <Confirmation
          title="Delete all files in /tmp?"
          description="This affects 14 files and cannot be undone."
          toolName={toolCall.name}
          onApprove={() => setApproved(true)}
          onReject={() => console.log('cancelled')}
        />
      ) : (
        <ToolCall toolCall={toolCall} />
      )}

      <Reasoning
        steps={[
          { id: '1', content: 'Parse user intent' },
          { id: '2', content: 'Select delete_files tool' },
          { id: '3', content: 'Await user approval' },
        ]}
      />

      <ChainThought
        steps={[
          { id: 't1', content: 'Scan directory', status: 'completed' },
          { id: 't2', content: 'Request approval', status: 'pending' },
        ]}
      />
    </div>
  );
}`,
  },
  {
    name: 'RAG citations',
    description:
      'Grounded answers with inline citations and a sources footer — the pattern for search and knowledge-base products.',
    features: ['InlineCitation chips', 'Sources footer', 'Suggestions'],
    code: `import {
  InlineCitation,
  Sources,
  Suggestions,
} from '@slipstream-ui/ai';
import type { SourceItem } from '@slipstream-ui/ai';

interface GroundedAnswer {
  answer: string;       // markdown with {{citation:N}} markers
  sources: SourceItem[];
  followUps: { id: string; text: string }[];
}

// Resolve citation markers to InlineCitation chips at render time.
function renderAnswer(answer: string, sources: SourceItem[]) {
  return answer.split(/\\{\\{citation:(\\d+)\\}\\}/).map((part, i) => {
    const source = sources[Number(part) - 1];
    if (i % 2 === 1 && source) {
      return <InlineCitation key={i} source={source} />;
    }
    return part;
  });
}

export function GroundedResponse({ result }: { result: GroundedAnswer }) {
  return (
    <div>
      <p>{renderAnswer(result.answer, result.sources)}</p>

      <Sources sources={result.sources} maxDisplay={3} />

      <Suggestions suggestions={result.followUps} />
    </div>
  );
}`,
  },
  {
    name: 'Form with validation',
    description:
      'Field-level validation, error states, and submit handling — the pattern for settings, signup, and data-entry flows.',
    features: ['Label + Input', 'Switch + Checkbox', 'Error states', 'Textarea + Select'],
    code: [
      "'use client';",
      '',
      "import { useState } from 'react';",
      'import {',
      '  Button,',
      '  Checkbox,',
      '  Input,',
      '  Label,',
      '  Select,',
      '  Switch,',
      '  Textarea,',
      "} from '@slipstream-ui/core';",
      '',
      'interface FormErrors {',
      '  email?: string;',
      '  password?: string;',
      '}',
      '',
      'export function SignupForm() {',
      "  const [email, setEmail] = useState('');",
      "  const [password, setPassword] = useState('');",
      "  const [bio, setBio] = useState('');",
      "  const [role, setRole] = useState('member');",
      '  const [agree, setAgree] = useState(false);',
      '  const [notify, setNotify] = useState(true);',
      '  const [errors, setErrors] = useState<FormErrors>({});',
      '',
      '  function validate(): boolean {',
      '    const next: FormErrors = {};',
      "    if (!email) next.email = 'Email is required';",
      "    else if (!email.includes('@')) next.email = 'Enter a valid email';",
      "    if (!password) next.password = 'Password is required';",
      "    else if (password.length < 8) next.password = 'Must be at least 8 characters';",
      '    setErrors(next);',
      '    return Object.keys(next).length === 0;',
      '  }',
      '',
      '  function handleSubmit(event: React.FormEvent) {',
      '    event.preventDefault();',
      '    if (!validate()) return;',
      '    // Submit to your API',
      '  }',
      '',
      '  return (',
      '    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">',
      '      <div className="space-y-1.5">',
      '        <Label htmlFor="email">Email</Label>',
      '        <Input',
      '          id="email"',
      '          type="email"',
      '          value={email}',
      '          onChange={(e) => setEmail(e.target.value)}',
      '          aria-invalid={Boolean(errors.email)}',
      "          aria-describedby={errors.email ? 'email-error' : undefined}",
      "          className={errors.email ? 'border-destructive' : ''}",
      '        />',
      '        {errors.email && (',
      "          <p id=\"email-error\" className=\"text-xs text-destructive\">{errors.email}</p>",
      '        )}',
      '      </div>',
      '',
      '      <div className="space-y-1.5">',
      '        <Label htmlFor="password">Password</Label>',
      '        <Input',
      '          id="password"',
      '          type="password"',
      '          value={password}',
      '          onChange={(e) => setPassword(e.target.value)}',
      '          aria-invalid={Boolean(errors.password)}',
      "          aria-describedby={errors.password ? 'password-error' : undefined}",
      "          className={errors.password ? 'border-destructive' : ''}",
      '        />',
      '        {errors.password && (',
      "          <p id=\"password-error\" className=\"text-xs text-destructive\">{errors.password}</p>",
      '        )}',
      '      </div>',
      '',
      '      <div className="space-y-1.5">',
      '        <Label htmlFor="role">Role</Label>',
      '        <Select',
      '          id="role"',
      '          value={role}',
      '          onChange={setRole}',
      '          options={[',
      "            { value: 'member', label: 'Member' },",
      "            { value: 'admin', label: 'Admin' },",
      '          ]}',
      '        />',
      '      </div>',
      '',
      '      <div className="space-y-1.5">',
      '        <Label htmlFor="bio">Bio</Label>',
      '        <Textarea',
      '          id="bio"',
      '          value={bio}',
      '          onChange={(e) => setBio(e.target.value)}',
      '          placeholder="Tell us about yourself"',
      '          maxLength={280}',
      '        />',
      '      </div>',
      '',
      '      <div className="flex items-center gap-2">',
      '        <Checkbox id="agree" checked={agree} onCheckedChange={setAgree} />',
      '        <Label htmlFor="agree">Accept terms and conditions</Label>',
      '      </div>',
      '',
      '      <div className="flex items-center justify-between">',
      '        <Label htmlFor="notify">Email notifications</Label>',
      '        <Switch id="notify" checked={notify} onCheckedChange={setNotify} />',
      '      </div>',
      '',
      '      <Button type="submit" disabled={!agree}>Create account</Button>',
      '    </form>',
      '  );',
      '}',
    ].join('\n'),
  },
  {
    name: 'Multi-thread chat',
    description:
      'Thread list beside the active conversation: per-thread message state, thread-scoped streaming, and a key-reset that keeps scroll state independent. The structure behind every chat product with a sidebar.',
    features: ['threads[] + activeId', 'Thread-scoped streaming', 'Conversation key reset', 'New thread flow'],
    code: `'use client';

import { useState } from 'react';
import { Conversation, PromptInput, Response } from '@slipstream-ui/ai';
import type { Message } from '@slipstream-ui/ai';

type Thread = { id: string; title: string; messages: Message[]; streamingId?: string | null };

export function MultiThreadChat({ initial }: { initial: Thread[] }) {
  const [threads, setThreads] = useState(initial);
  const [activeId, setActiveId] = useState(initial[0].id);
  const active = threads.find((t) => t.id === activeId)!;

  const patch = (id: string, next: Partial<Thread>) =>
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, ...next } : t)));

  async function send(text: string) {
    // Stream into the thread captured at send time — never "the active one",
    // the user may switch threads mid-generation.
    const target = active.id;
    patch(target, { messages: [...active.messages, { id: crypto.randomUUID(), role: 'user', content: text }] });
    // ... append assistant message, stream chunks into target thread only,
    //     clear target.streamingId when done.
  }

  return (
    <div className="flex h-[600px]">
      <aside className="w-56 space-y-1 border-r p-2">
        {threads.map((t) => (
          <button key={t.id} onClick={() => setActiveId(t.id)}
            className={'block w-full truncate rounded-md px-2 py-1.5 text-left text-sm ' +
              (t.id === active.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground')}>
            {t.title}
          </button>
        ))}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* key resets scroll + welcome state per thread */}
        <Conversation
          key={active.id}
          messages={active.messages}
          streamingMessageId={active.streamingId ?? undefined}
          renderContent={(content) => <Response parseIncompleteMarkdown>{content}</Response>}
          className="flex-1"
        />
        <PromptInput onSubmit={send} isLoading={Boolean(active.streamingId)} />
      </div>
    </div>
  );
}`,
  },
];

export default function TemplatesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-4">Templates</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Complete, copy-paste patterns built entirely from Slipstream UI components. Each one is
        stateless — you own the data flow and transport.
      </p>

      <div className="space-y-12">
        {templates.map((template, index) => (
          <section key={template.name}>
            <h2 className="text-2xl font-semibold mb-2">{template.name}</h2>
            <p className="text-muted-foreground mb-3">{template.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {template.features.map((feature) => (
                <span
                  key={feature}
                  className="text-xs px-2 py-0.5 rounded-full border border-border bg-muted text-muted-foreground"
                >
                  {feature}
                </span>
              ))}
            </div>
            {DEMOS[index] && (
              <div className="mb-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Live demo — try it
                </p>
                {DEMOS[index]}
              </div>
            )}
              <CodeBlock language="tsx" code={template.code} />
          </section>
        ))}
      </div>
    </div>
  );
}
