'use client';

import { useEffect, useState } from 'react';
import { CommandPalette, type Command } from '@slipstream-ui/ai';
import { ComponentPage, type ComponentPageProps } from '@/components/component-page';
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

export default function CommandPalettePage({ manifest }: { manifest?: ComponentPageProps['manifest'] }) {
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
    <ComponentPage
        manifest={manifest}
      id="command-palette"
      title="CommandPalette"
      description="Cmd+K style command palette with lexical search, sectioned results and full keyboard navigation. Supports a static command list or an async loadCommands source."
      npmPackages="@slipstream-ui/ai"
      propsRows={[
        {
          name: 'open',
          type: 'boolean',
          defaultValue: 'required',
          description: 'Controlled visibility',
        },
        {
          name: 'onOpenChange',
          type: '(open: boolean) => void',
          defaultValue: 'required',
          description: 'Open/close requests',
        },
        {
          name: 'commands',
          type: 'Command[]',
          defaultValue: 'required',
          description: '{ id, label, section?, keywords?, icon?, description?, shortcut? }; ignored for filtering when loadCommands is set',
        },
        {
          name: 'onSelect',
          type: '(command: Command) => void',
          defaultValue: 'required',
          description: 'Chosen command handler',
        },
        {
          name: 'loadCommands',
          type: '(query: string) => Promise<Command[]>',
          description: 'Async command source called with the current query (debounced)',
        },
        {
          name: 'debounceMs',
          type: 'number',
          defaultValue: '200',
          description: 'Debounce for loadCommands',
        },
        {
          name: 'renderCommand',
          type: '(command: Command, { active }: { active: boolean }) => ReactNode',
          description: 'Custom row renderer for icons, badges or metadata',
        },
        {
          name: 'loadingText',
          type: 'string',
          defaultValue: "'Searching…'",
          description: 'Shown while async commands load',
        },
        {
          name: 'placeholder',
          type: 'string',
          defaultValue: "'Type a command.'",
          description: 'Input placeholder',
        },
        {
          name: 'dialogLabel',
          type: 'string',
          defaultValue: "'Command palette'",
          description: 'Accessible label for the combobox',
        },
        {
          name: 'listLabel',
          type: 'string',
          defaultValue: "'Commands'",
          description: 'Accessible label for the listbox',
        },
        {
          name: 'emptyText',
          type: 'string',
          defaultValue: "'No matching commands.'",
          description: 'Shown when no command matches',
        },
      ]}
      accessibility={[
        'Combobox pattern with aria-expanded, aria-controls and aria-activedescendant',
        'Arrow keys cycle options, Enter selects, Escape closes; focus stays in the input',
        'Options are role=option with aria-selected marking the active item',
      ]}
    >
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
    </ComponentPage>
  );
}
