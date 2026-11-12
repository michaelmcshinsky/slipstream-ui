# Drawer

Edge sheet for secondary flows: slides from any side (sm/md/lg), with Dialog-grade modal semantics (portal, focus trap, Escape, focus restoration).

> Import: `import { Drawer } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/drawer.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Filters, detail panes, and mobile navigation need more room than a popover but shouldn't hijack the whole screen like a dialog. Drawer is an edge-anchored sheet with the SAME a11y contract as Dialog — portal, aria-modal, focus trap, Escape, focus restore — so swapping between them never regresses keyboard or screen-reader behavior.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| open | `boolean` | — | yes | Whether the drawer is visible (controlled). |
| onOpenChange | `(open: boolean) => void` | — | no | Close requests (✕, Escape, backdrop, your own triggers). |
| onClose | `() => void` | — | no | Close-request alias for onOpenChange(false); used when only a close handler is passed. |
| title | `string` | — | yes | Accessible dialog name rendered as the header title. |
| description | `string` | — | no | Supporting line under the title (wired via aria-describedby). |
| side | `'left' | 'right' | 'top' | 'bottom'` | `right` | no | Edge the drawer slides from. |
| size | `'sm' | 'md' | 'lg' | 'xl' | '2xl'` | `md` | no | Preset extent along the side axis (width for left/right, height for top/bottom). |
| width | `number | string` | — | no | Custom extent for left/right drawers: pixels (480) or any CSS length ("70vw"). Overrides size. |
| height | `number | string` | — | no | Custom extent for top/bottom drawers: pixels (320) or any CSS length ("60vh"). Overrides size. |
| resizable | `boolean` | `false` | no | Drag the inner edge to resize a left/right drawer. Arrow keys nudge 16px, Shift+Arrow 64px, Home/End jump to the bounds. Ignored for top/bottom drawers. |
| minWidth | `number` | `240` | no | Lower width bound in pixels while resizable. |
| maxWidth | `number` | `960` | no | Upper width bound in pixels while resizable. |
| defaultWidth | `number` | — | no | Initial width in pixels while resizable; defaults to the size preset. |
| onWidthChange | `(width: number) => void` | — | no | Fired with the next width in pixels when a resize commits. |
| resizeLabel | `string` | `Resize drawer` | no | Accessible label for the resize handle. |
| closeOnBackdrop | `boolean` | `true` | no | Clicking the backdrop closes the drawer. |
| showClose | `boolean` | `true` | no | Hide the header ✕ button (Escape and backdrop still close). |
| closeLabel | `string` | `'Close drawer'` | no | Accessible label for the close button. |
| initialFocusRef | `RefObject<HTMLElement | null>` | — | no | Element focused on open (defaults to the first focusable element). |
| ariaLabel | `string` | — | no | Overrides the accessible name (defaults to the title). |
| animate | `boolean` | `false` | no | Slide the panel in from its edge and out on close (needs tailwindcss-animate; reduced motion respected). |

## Examples

### Filter panel from the right

The workhorse: side panel that keeps context visible.

```tsx
<Button onClick={() => setFiltersOpen(true)}>Filters</Button>
<Drawer
  open={filtersOpen}
  onOpenChange={setFiltersOpen}
  title="Filter results"
  description="Narrow by status and date"
  side="right"
  size="md"
>
  <FilterControls />
</Drawer>
```

### Mobile navigation from the bottom

```tsx
<Drawer open={open} onOpenChange={setOpen} title="Jump to" side="bottom" size="sm">
  <nav className="flex flex-col gap-2">
    <a href="/docs">Docs</a>
    <a href="/docs/components">Components</a>
  </nav>
</Drawer>
```

## Anti-patterns

- **Don't use a Drawer for a single decision** — One-question gates belong in Confirmation (alertdialog) — a whole sheet for approve/reject buries the decision.
- **Don't stack sheets** — Two open drawers fight for focus and z-index. Close the first (or render one container) before opening another.
- **Don't hide critical actions in a closed drawer** — Drawers are secondary flows — the primary action must stay visible on the page.

## Accessibility

- **Modal dialog semantics**: role=dialog + aria-modal, labelled by title, described by description; portal to body
- **Focus management**: Focus moves to the first focusable element on open, is trapped with Tab/Shift+Tab, and restores to the opener on close
- **Dismissal parity with Dialog**: Escape closes; backdrop click closes when closeOnBackdrop (default)
- **Scroll containment**: Body region scrolls internally (overflow-y-auto) — the page behind never scrolls

## Composition

- Compose with **Button** — The trigger that opens the drawer (aria-haspopup optional)
  
  ```tsx
  <Button onClick={() => setOpen(true)}>Filters</Button>
  ```
- Compose with **Form / FormLayout / FormField** — Drawers commonly host forms — spacing and wiring come from the form family
  
  ```tsx
  <Drawer …><FormLayout layout="stack">…</FormLayout></Drawer>
  ```
- Compose with **Dialog** — Dialog for centered modal decisions; Drawer for edge-anchored secondary flows
- Related: Dialog, Popover, Form

