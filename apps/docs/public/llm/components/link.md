# Link

Inline link primitive with default/muted/underline/arrow/external variants, asChild router support and safe external handling.

> Import: `import { Link } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/link.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

Every codebase re-implements inline links with inconsistent variants and unsafe target=_blank. Link centralizes the variants, keeps a real <a href> (SEO, modified clicks) and adds rel=noopener plus a screen-reader note for external URLs.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| href | `string` | — | no | Destination URL (pass through or via asChild). |
| variant | `'default' | 'muted' | 'underline' | 'arrow' | 'external'` | `default` | no | Visual style. |
| asChild | `boolean` | `false` | no | Render the child (router Link) with link styling. |
| external | `boolean` | — | no | Force external handling; absolute http(s) URLs are auto-detected, mailto/tel never open a new tab. |

## Examples

### Inline link

Internal links stay client-side; absolute URLs open safely in a new tab.

```tsx
<Link href="/docs">Read the docs</Link>
<Link href="https://github.com" variant="external">GitHub</Link>
```

### Router link

Preserves prefetch and modified-click behavior.

```tsx
<Link asChild variant="underline"><RouterLink href="/posts">Posts</RouterLink></Link>
```

## Anti-patterns

- **Don't use Link for buttons** — Actions belong in Button; Link is for navigation.

## Accessibility

- **Real anchors**: Renders <a href> so middle-click/modified clicks work
- **External notice**: External links get rel=noopener noreferrer and a screen-reader note

## Composition

- Compose with **Card / List** — asChild makes whole-card links safe
  
  ```tsx
  <Card asChild><Link href="/post">…</Link></Card>
  ```
- Related: Button, Breadcrumb, Card

