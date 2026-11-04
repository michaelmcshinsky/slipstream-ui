# List / ListItem

Semantic list (ul/li) for rows of related items: settings, results, nav — with leading/trailing slots, selection, and pressable rows.

> Import: `import { List } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/list.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Row collections are lists, not tables or div stacks: screen readers announce item counts and navigate by item. List/ListItem keep that semantics while providing the layout vocabulary (slots, dividers, density, selection) that real product UIs need — and a pressable row wraps its content in a button so ul > li structure stays valid.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| divided | `boolean` | `false` | no | Hairline dividers between rows (List). |
| bordered | `boolean` | `false` | no | Card-like surface and border around the list (List). |
| size | `'default' | 'compact'` | `default` | no | Row density (List). |
| leading | `ReactNode` | — | no | Leading slot: icon, avatar, status dot, or checkbox (ListItem). |
| trailing | `ReactNode` | — | no | Trailing slot: chevron, badge, meta, or action (ListItem). |
| selected | `boolean` | `false` | no | Marks the row as the active/selected item (ListItem). |
| description | `string` | — | no | Secondary line under the main content (ListItem). |
| onClick | `() => void` | — | no | Makes the row pressable — content renders inside a full-width button so list semantics stay intact (ListItem). |

## Examples

### Settings rows with selection

selected highlights the active row; description adds a sub-line.

```tsx
<List bordered divided>
  <ListItem leading={<Icon />} trailing={<Badge>new</Badge>} selected>
    Notifications
  </ListItem>
  <ListItem leading={<Icon />} description="Weekly digest every Monday">
    Digest
  </ListItem>
</List>
```

### Pressable rows

onClick renders the row content inside a <button> — keyboard and screen-reader behavior come free.

```tsx
<List bordered>
  {threads.map((t) => (
    <ListItem key={t.id} onClick={() => open(t.id)} trailing={<Chevron />}>
      {t.title}
    </ListItem>
  ))}
</List>
```

## Anti-patterns

- **Don't use a table for non-tabular rows** — Tables imply column relationships. Rows of independent items are lists — assistive tech announces them as such.
- **Don't put onClick on the li itself** — Let ListItem wrap content in a button (which it does automatically) — a click handler on li breaks list semantics for screen readers.

## Accessibility

- **Native list structure**: Renders <ul>/<li>; screen readers announce item counts and per-item navigation
- **Pressable rows are buttons**: onClick rows wrap content in a full-width <button> with focus ring and disabled support
- **Selection is visual only**: selected uses aria-current-less styling; add aria-current on the row via props when it marks location

## Composition

- Compose with **Block** — Wrap a List in a Block section for titled groups
- Compose with **Badge / Avatar** — Common leading/trailing slot content
- Related: Table, Menu, Card

