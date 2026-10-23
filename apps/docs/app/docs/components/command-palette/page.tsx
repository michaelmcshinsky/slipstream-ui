'use client';

import { useEffect, useState } from 'react';
import { CommandPalette, type Command } from '@slipstream-ui/ai';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

const commands: Command[] = [
  { id: 'go-docs', label: 'Open documentation', section: 'Navigation', keywords: ['docs', 'help'], shortcut: '⌘D' },
  { id: 'go-billing', label: 'Open billing', section: 'Navigation', keywords: ['plan', 'invoices'] },
  { id: 'act-copy', label: 'Copy code', section: 'Actions', keywords: ['clipboard'], shortcut: '⌘C' },
  { id: 'act-theme', label: 'Toggle dark mode', section: 'Actions', keywords: ['theme', 'dark', 'light'] },
];

export default function CommandPalettePage() {
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
      id="command-palette"
      title="CommandPalette"
      description="Cmd+K style command palette with lexical search, sectioned results and full keyboard navigation."
      npmPackages="@slipstream-ui/ai"
      propsRows={[
        { name: 'open', type: 'boolean', defaultValue: 'required', description: 'Controlled visibility' },
        { name: 'onOpenChange', type: '(open: boolean) => void', defaultValue: 'required', description: 'Open/close requests' },
        { name: 'commands', type: 'Command[]', defaultValue: 'required', description: '{ id, label, section?, keywords?, shortcut? }' },
        { name: 'onSelect', type: '(command: Command) => void', defaultValue: 'required', description: 'Chosen command handler' },
        { name: 'placeholder', type: 'string', defaultValue: 'Type a command…', description: 'Input placeholder' },
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
            {last && <p className="mt-2 text-sm text-muted-foreground">Last selected: {last}</p>}
            <CommandPalette
              open={open}
              onOpenChange={setOpen}
              commands={commands}
              onSelect={(command) => setLast(command.label)}
            />
          </>
        }
        code={`<CommandPalette
  open={open}
  onOpenChange={setOpen}
  commands={[
    { id: 'go-docs', label: 'Open documentation', section: 'Navigation' },
    { id: 'act-copy', label: 'Copy code', section: 'Actions' },
  ]}
  onSelect={(command) => run(command.id)}
/>`}
      />
    </ComponentPage>
  );
}
