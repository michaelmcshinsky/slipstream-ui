# Hero

Marketing hero with badge, eyebrow, headline, copy, actions and an optional media slot.

> Import: `import { Hero } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/hero.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

Landing pages repeat a headline cluster with an optional product shot. Hero standardizes the hierarchy and the split/centered layouts while leaving the band tone and padding to Section.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| title | `ReactNode` | — | yes | Main headline. Accepts inline markup for a highlighted phrase. |
| description | `ReactNode` | — | no | Supporting sentence under the headline. |
| eyebrow | `ReactNode` | — | no | Small overline above the headline. |
| badge | `ReactNode` | — | no | Pill above the headline for an announcement, category or proof point. |
| actions | `ReactNode` | — | no | Primary and secondary calls to action. |
| media | `ReactNode` | — | no | Product shot, illustration, video or form shown beside the copy. |
| mediaPosition | `'left' | 'right'` | `right` | no | Which side the media sits on at lg and up. |
| align | `'left' | 'center'` | `left` | no | Copy alignment. Centered is typically used without media. |
| size | `'md' | 'lg'` | `lg` | no | Headline scale. |
| level | `1 | 2` | `1` | no | Heading level. Use 2 when the hero is nested under a page h1. |
| variant | `'split' | 'centered'` | — | no | Split places copy and media side by side; centered stacks copy in a narrow column. Defaults to split when media is provided. |
| as | `'div' | 'section' | 'header'` | `div` | no | Semantic element to render. |

## Examples

### Split hero

Copy on the left, product media on the right.

```tsx
<Section tone="inverse">
  <Hero
    badge="The private deal network"
    title="Find your next buyer."
    description="Join 20,000+ investors and advisors."
    actions={<Button>Get started</Button>}
    media={<ProductMockup />}
  />
</Section>
```

### Centered hero

A narrow centered hero for a page band.

```tsx
<Hero
  align="center"
  eyebrow="Network overview"
  title="A fragmented market, made easier"
  description="Current activity across the network."
/>
```

## Anti-patterns

- **Don't use Hero as the only page heading twice** — A page should have one h1. Use level={2} for a second hero-like band or PageHeader for documentation pages.
- **Don't hardcode the band color** — Wrap Hero in Section and use its tone so child tokens stay readable.

## Accessibility

- **Headline semantics**: Renders h1 by default and accepts level={2}
- **Media alternative**: Media is a slot; the consumer controls alt text

## Composition

- Compose with **Section** — Hero sits inside Section; Section owns tone and padding
  
  ```tsx
  <Section tone="inverse"><Hero title="." /></Section>
  ```
- Compose with **Button** — Put one primary and at most one secondary action in actions
  
  ```tsx
  <Hero actions={<><Button>Start</Button><Button variant="outline">Learn more</Button></>} />
  ```
- Related: Section, PageHeader, StatBand, CTASection

