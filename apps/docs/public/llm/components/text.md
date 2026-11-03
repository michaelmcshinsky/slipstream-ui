# Text

Semantic paragraph text with a controlled type scale; renders a real p (or span with inline).

> Import: `import { Text } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/text.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

Body copy should be a paragraph element, not a styled div — reader modes, screen readers, and document outline all depend on semantics. Text gives you the type scale, weight, and muted tone as typed props so spacing and color stay tokenized instead of ad-hoc utilities.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| inline | `boolean` | `false` | no | Render as an inline span instead of a block p (the inline-block variation). |
| size | `'xs' | 'sm' | 'base' | 'lg' | 'xl'` | `base` | no | Type scale step. |
| weight | `'normal' | 'medium' | 'semibold' | 'bold'` | — | no | Font weight. |
| muted | `boolean` | `false` | no | Use the muted-foreground token instead of the primary text color. |

## Examples

### Paragraph and inline text

block by default; inline for span-level flow.

```tsx
<Text>Default body paragraph.</Text>
<Text size="sm" muted>Secondary helper copy.</Text>
<Text weight="semibold">Emphasized lead-in.</Text>

{/* Inline flow — renders a <span> */}
<Text inline size="sm">Read the </Text>
<Link href="/docs">docs</Link>
```

## Anti-patterns

- **Don't use divs for copy** — A div with text classes is invisible to document outline, reader mode, and search extraction. Use Text (p) for paragraphs and Heading for titles.
- **Don't skip headings for visual size** — Pick the Heading LEVEL that matches the document structure and use size for visual override — never a large Text.

## Accessibility

- **Real text elements**: Renders <p>/<span>, so assistive tech and reader modes treat content as text
- **Muted tone is tokenized**: muted uses --muted-foreground, which meets AA in both themes

## Composition

- Compose with **Heading** — Headings structure the document; Text carries the prose between them
- Compose with **Block** — Use Block (div) for layout wrappers around Text, not instead of it
- Related: Heading, Block

