# CommandPalette

Cmd+K style command palette with lexical search, sectioned results and full keyboard navigation

> Import: `import { CommandPalette } from '@slipstream-ui/ai'`
> Registry: https://slipstreamui.com/registry/command-palette.json
> Tier: organism · Package: @slipstream-ui/ai

## Design intent

AI-assisted and power-user apps expose many actions; a command palette keeps them all one keystroke away. The palette is a combobox+listbox with aria-activedescendant navigation so focus never leaves the input, filters lexically over labels/sections/keywords, and reports selection through a single callback.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| open | `boolean` | — | yes | Whether the palette is visible (controlled) |
| onOpenChange | `(open: boolean) => void` | — | yes | Called when the user opens or dismisses the palette |
| commands | `Command[]` | — | yes | Available commands: { id, label, section?, keywords?, shortcut? } |
| onSelect | `(command: Command) => void` | — | yes | Invoked with the chosen command before the palette closes |
| placeholder | `string` | `Type a command…` | no | Input placeholder text |
| loadCommands | `(query: string) => Promise<Command[]>` | — | no | Async command source; debounced and stale-response guarded. |
| debounceMs | `number` | `200` | no | Debounce for loadCommands in ms. |
| renderCommand | `(command, state: { active: boolean }) => ReactNode` | — | no | Custom row renderer (icons, type badges). |
| loadingText | `string` | — | no | Shown while async commands load. |

## Examples

### Wired to Cmd+K

Toggle the palette with Cmd/Ctrl+K and run the selected command.

```tsx
const [open, setOpen] = useState(false);

useEffect(() => {
  const onKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      setOpen((current) => !current);
    }
  };
  window.addEventListener('keydown', onKeyDown);
  return () => window.removeEventListener('keydown', onKeyDown);
}, []);

<CommandPalette
  open={open}
  onOpenChange={setOpen}
  commands={commands}
  onSelect={(command) => run(command.id)}
/>
```

## Anti-patterns

- **Do not use the palette as a text editor command** — The palette searches discrete commands. For AI chat input use PromptInput instead.

## Accessibility

- **Combobox pattern**: The input uses role=combobox with aria-expanded, aria-controls, aria-activedescendant and aria-autocomplete=list.
- **Keyboard navigation**: Arrow keys cycle options, Enter selects, Escape closes; focus never leaves the input.
- **Option semantics**: Each result is role=option with aria-selected marking the active item.

## Composition

- Compose with **PromptInput** — CommandPalette switches modes/actions; PromptInput captures free-form chat text.
- Related: PromptInput, Dialog

