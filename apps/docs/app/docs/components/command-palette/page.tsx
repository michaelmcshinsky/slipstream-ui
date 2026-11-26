import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/command-palette', {
  title: "CommandPalette",
  description: "Cmd+K style command palette with lexical search, sectioned results and full keyboard navigation.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('command-palette')}
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
      <Demo />
    </ComponentPage>
  );
}
