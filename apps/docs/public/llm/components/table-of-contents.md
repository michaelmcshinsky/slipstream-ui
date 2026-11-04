# TableOfContents

Sticky 'On this page' navigation with nested levels and aria-current, plus a useScrollSpy hook for the active heading.

> Import: `import { TableOfContents } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/table-of-contents.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Long-form pages drift into bespoke TOC implementations. TableOfContents fixes the nested list, active styling and landmark name; useScrollSpy supplies the active id from real scroll position.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| headings | `TocHeading[]` | — | yes | Headings: { id, text, level: 2 | 3 | 4 }. |
| activeId | `string` | — | no | Controlled active heading (pair with useScrollSpy). |
| label | `string` | `On this page` | no | Accessible name of the nav landmark. |
| sticky | `boolean` | `true` | no | Stick while the article scrolls. |

## Examples

### Article TOC

Scroll-spy driven active state.

```tsx
const activeId = useScrollSpy(headings.map((h) => h.id));

<TableOfContents headings={headings} activeId={activeId} />
```

## Anti-patterns

- **Don't hardcode the active id** — Compute it from scroll position so the highlight follows the reader.

## Accessibility

- **Landmark + current item**: nav aria-label plus aria-current=location on the active link

## Composition

- Compose with **Prose** — Pairs with article bodies
  
  ```tsx
  <TableOfContents headings={headings} activeId={active} />
  ```
- Related: Prose, Breadcrumb, List

