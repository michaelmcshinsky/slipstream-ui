# Block

Semantic container (div by default, swappable element) — the structural counterpart to Text (p).

> Import: `import { Block } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/block.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

Layout wrappers should still mean something: section, article, figure. Block is a typed, discoverable div that picks the element matching the content's role, with an inline (span) variation for flow contexts — no default decoration, so it composes with any utilities.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| as | `'div' | 'span' | 'section' | 'article' | 'figure' | 'header' | 'footer' | 'nav' | 'main' | 'aside'` | `div` | no | Semantic element to render. |
| inline | `boolean` | `false` | no | Shorthand for as="span" — inline flow instead of a block box. |
| muted | `boolean` | `false` | no | Use the muted-foreground token for the block's text. |

## Examples

### Semantic containers

```tsx
<Block as="section" className="space-y-2">
  <Heading level={3}>Related</Heading>
  <Text size="sm" muted>Prose lives in Text, not Block.</Text>
</Block>

<Block as="figure">…</Block>

{/* Inline flow */}
<Block inline>…</Block>
```

### Card-like surface via utilities

```tsx
<Block className="rounded-lg border border-border p-4">…</Block>
```

## Anti-patterns

- **Don't put paragraphs inside Block** — Copy belongs in Text (p). Block is structure — mixing them loses document semantics.
- **Don't default to div when a landmark fits** — If the content is a section of page structure, as="section"/"article" gives assistive tech navigable landmarks for free.

## Accessibility

- **Element choice is explicit**: as/inline map to real intrinsic elements (semantic by selection)
- **No interactive defaults**: Block renders no focusable content of its own

## Composition

- Compose with **Text / Heading** — Block wraps structure; Text and Heading provide the content semantics
- Compose with **Flex / Grid** — Compose layout as Block → Flex/Grid → Text/Heading hierarchies
- Related: Text, Heading, Flex, Grid

