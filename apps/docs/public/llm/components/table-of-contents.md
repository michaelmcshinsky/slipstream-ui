# TableOfContents

Sticky 'On this page' navigation with real anchor links, nested levels and aria-current, plus a useScrollSpy hook for the active heading.

> Import: `import { TableOfContents } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/table-of-contents.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Long-form pages drift into bespoke TOC implementations. TableOfContents fixes the nested list, native anchor navigation, active styling and landmark name; useScrollSpy supplies the active id from real scroll position.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| headings | `TocHeading[]` | — | yes | Headings: { id, text, level: 2 | 3 | 4 }. |
| activeId | `string` | — | no | Controlled active heading (pair with useScrollSpy). |
| label | `string` | `On this page` | no | Accessible name of the nav landmark. |
| sticky | `boolean` | `true` | no | Stick while the article scrolls. |
| ariaLabel | `string` | — | no | Accessible name for the nav landmark when it differs from the visible label. |
| labelClassName | `string` | — | no | Extra classes for the visible label. |
| onNavigate | `(id: string) => void` | — | no | Called with the heading id when a link is activated. The browser still performs the native anchor jump; use it to sync a controlled activeId, analytics, or close a mobile TOC. |

## Examples

### Article TOC

Scroll-spy driven active state; links are native anchors.

```tsx
const ids = headings.map((h) => h.id);
const activeId = useScrollSpy(ids);

<TableOfContents headings={headings} activeId={activeId} />
```

### Controlled TOC with navigation callback

Update local state when a heading is chosen; the anchor still scrolls and updates the hash.

```tsx
<TableOfContents
  headings={headings}
  activeId={activeId}
  onNavigate={(id) => {
    setActiveId(id);
    setMobileOpen(false);
  }}
/>
```

## Anti-patterns

- **Don't hardcode the active id** — Compute it from scroll position so the highlight follows the reader.
- **Don't replace the anchors with buttons** — Buttons only run a highlight callback and break deep links, middle-click, and open-in-new-tab. The component renders real anchors; keep them.

## Accessibility

- **Landmark + current item**: nav aria-label plus aria-current=location on the active link
- **Native anchor navigation**: Each item is an a[href='#id'], so Enter, middle-click and deep links work

## Composition

- Compose with **Prose** — Pairs with article bodies
  
  ```tsx
  <TableOfContents headings={headings} activeId={active} />
  ```
- Related: Prose, Breadcrumb, List

