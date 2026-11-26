'use client';

import { useEffect, useState } from 'react';
import { CommandPalette, type Command } from '@slipstream-ui/ai';
import { DemoCard } from '@/components/demo-card';

const commands: Command[] = [
  {
    id: 'go-docs',
    label: 'Open documentation',
    section: 'Navigation',
    keywords: ['docs', 'help'],
    shortcut: '⌘D',
  },
  {
    id: 'go-billing',
    label: 'Open billing',
    section: 'Navigation',
    keywords: ['plan', 'invoices'],
  },
  {
    id: 'act-copy',
    label: 'Copy code',
    section: 'Actions',
    keywords: ['clipboard'],
    shortcut: '⌘C',
  },
  {
    id: 'act-theme',
    label: 'Toggle dark mode',
    section: 'Actions',
    keywords: ['theme', 'dark', 'light'],
  },
];

export default function Demo() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <DemoCard
        title="Playground"
        preview={
          <>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Open palette (⌘K)
            </button>
            {last && (
              <p className="mt-2 text-sm text-muted-foreground">
                Last selected: {last}
              </p>
            )}
            <CommandPalette
              open={open}
              onOpenChange={setOpen}
              commands={commands}
              onSelect={(command) => setLast(command.label)}
            />
          </>
        }
        code={`const [open, setOpen] = useState(false);

// Wire your own shortcut (the docs demo listens for ⌘K/Ctrl+K)
<CommandPalette
  open={open}
  onOpenChange={setOpen}
  commands={[
    { id: 'go-docs', label: 'Open documentation', section: 'Navigation' },
    { id: 'act-copy', label: 'Copy code', section: 'Actions' },
  ]}
  onSelect={(command) => run(command.id)}
/>`}
        usage={`// Async variant: swap commands for loadCommands and the palette
// filters server-side instead of over the static list.
<CommandPalette
  open={open}
  onOpenChange={setOpen}
  commands={[]}
  loadCommands={async (query) => searchCommands(query)}
  onSelect={run}
/>`}
      />
    </>
  );
}
