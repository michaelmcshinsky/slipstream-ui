# Heading

Semantic heading (h1-h6) with a safe default scale and an optional visual-size override.

> Import: `import { Heading } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/heading.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

Document structure and visual size are different axes: screen readers and SEO need the correct h-level, while design sometimes needs a smaller visual size. Heading takes level (semantic) and size (visual) separately so outline integrity never gets sacrificed for typography.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| level | `1 | 2 | 3 | 4 | 5 | 6` | — | yes | Semantic level — renders the matching h1..h6 element. |
| size | `'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'` | — | no | Visual size override, independent of the semantic level. |
| muted | `boolean` | `false` | no | Use the muted-foreground token instead of the primary text color. |

## Examples

### Structural heading with visual override

```tsx
<Heading level={2}>Section title</Heading>

{/* h4 semantics (correct outline position) but large visual size) */}
<Heading level={4} size="2xl">Card headline</Heading>
```

### Muted subheading

```tsx
<Heading level={3} size="sm" muted>Supporting label</Heading>
```

## Anti-patterns

- **Never skip levels for styling** — Jumping h1 -> h3 breaks the outline assistive tech announces. Use size for visual weight; level stays sequential.
- **Don't use Text as a heading** — A bolded paragraph is not a heading: navigation panes and find-in-page won't index it.

## Accessibility

- **Correct heading elements**: Renders h1..h6 from the level prop; default scale keeps visual hierarchy aligned with structure
- **Tokenized color**: muted uses --muted-foreground (AA in both themes)

## Composition

- Compose with **Text** — Headings introduce sections; Text carries the prose
- Related: Text, Block

