# Source / Sources

Displays citations and references for an AI response. `Source` renders a single citation; `Sources` renders a numbered list with an overflow count.

> Import: `import { Source } from '@slipstream-ui/ai'`
> Registry: https://slipstreamui.com/registry/source.json
> Tier: molecule · Package: @slipstream-ui/ai

## Design intent

Make generated answers transparent by showing where information came from.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| sources | `SourceItem[]` | — | yes | References to display (Sources only). |
| maxDisplay | `number` | `3` | no | Maximum number of references to show before an overflow indicator. |
| label | `string` | `Sources` | no | Heading label; override for localization. |
| index | `number` | — | no | 1-based citation marker rendered as [n]; omit on Source to hide numbering. |

## Examples

### Citations list

```tsx
<Sources sources={[{ id: '1', title: 'React docs', url: 'https://react.dev' }, { id: '2', title: 'MDN', url: 'https://developer.mozilla.org' }]} />
```

### Single inline citation

```tsx
<Source source={{ id: '1', title: 'React docs', url: 'https://react.dev' }} index={1} />
```

## Anti-patterns

- **Do not nest Sources inside Sources** — Sources is a list container; compose individual Source items only when building a custom layout.

## Accessibility

- **Link semantics**: References use native links with rel=noopener when URLs are provided.
- **Decorative markers**: [n] citation markers are aria-hidden; titles are read as link text.

