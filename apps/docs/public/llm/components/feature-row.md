# FeatureRow

Alternating media and copy row for mid-page feature sections.

> Import: `import { FeatureRow } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/feature-row.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

Landing pages alternate a product shot with a short feature story. FeatureRow owns the two-column rhythm and media side without taking over the page h1, which belongs to Hero or PageHeader.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| title | `ReactNode` | — | yes | Row heading. |
| description | `ReactNode` | — | no | Supporting copy. |
| eyebrow | `ReactNode` | — | no | Small overline above the heading. |
| actions | `ReactNode` | — | no | Calls to action. |
| media | `ReactNode` | — | yes | Image, mockup, video or form shown beside the copy. |
| mediaPosition | `'left' | 'right'` | `right` | no | Which side the media sits on at lg and up. |
| level | `2 | 3` | `2` | no | Heading level. |
| size | `'md' | 'lg'` | `md` | no | Heading scale. |

## Examples

### Alternating feature

A standard feature row with media on the right.

```tsx
<FeatureRow
  eyebrow="For advisors"
  title="Reach relevant investors"
  description="Run a confidential, data-informed process."
  media={<img src="/deal-flow.png" alt="Deal flow dashboard" />}
  actions={<Button>Request access</Button>}
/>
```

## Anti-patterns

- **Don't use FeatureRow for the page hero** — Use Hero for the opening story and h1. FeatureRow defaults to h2 and is intended for mid-page sections.

## Accessibility

- **Heading level**: Renders h2 by default and accepts level 3
- **Media alternative**: Media is a slot; the consumer owns alt text

## Composition

- Compose with **Section** — Place FeatureRow inside a Section, usually three to five in sequence
  
  ```tsx
  <Section><FeatureRow title="." media={<Media />} /></Section>
  ```
- Related: Hero, FeatureGrid, Section

