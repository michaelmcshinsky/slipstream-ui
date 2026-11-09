# Hero

Responsive marketing hero with badge, eyebrow, headline, copy, actions and an optional media slot.

> Import: `import { Hero } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/hero.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

Landing pages repeat a headline cluster with an optional product shot. Hero standardizes the hierarchy and four responsive layouts (split, centered, stacked, overlay) while leaving the band tone and padding to Section.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| title | `ReactNode` | — | yes | Main headline. Accepts inline markup for a highlighted phrase. |
| description | `ReactNode` | — | no | Supporting sentence under the headline. |
| eyebrow | `ReactNode` | — | no | Small overline above the headline. |
| badge | `ReactNode` | — | no | Pill above the headline for an announcement, category or proof point. |
| actions | `ReactNode` | — | no | Primary and secondary calls to action. |
| media | `ReactNode` | — | no | Product shot, illustration, video or form shown beside or behind the copy. |
| mediaPosition | `'left' | 'right'` | `right` | no | Which side the media sits on at lg and up in the split layout. |
| align | `'left' | 'center'` | `left` | no | Copy alignment. Centered is typically used without media. |
| size | `'md' | 'lg'` | `lg` | no | Headline scale. |
| level | `1 | 2` | `1` | no | Heading level. Use 2 when the hero is nested under a page h1. |
| variant | `'split' | 'centered' | 'stacked' | 'overlay'` | — | no | Layout. split puts copy and media side by side at lg and up; centered stacks copy in a narrow column; stacked puts copy above full-width media; overlay places media behind the copy with a theme-aware scrim. Defaults to split when media is provided and centered without it. |
| as | `'div' | 'section' | 'header'` | `div` | no | Semantic element to render. |
| titleClassName | `string` | — | no | Extra classes for the headline, for host display typography. |
| descriptionClassName | `string` | — | no | Extra classes for the description. |
| eyebrowClassName | `string` | — | no | Extra classes for the eyebrow. |
| badgeClassName | `string` | — | no | Extra classes for the badge wrapper. |
| mediaClassName | `string` | — | no | Extra classes for the media wrapper. |

## Examples

### Split hero

Copy on the left, product media on the right; stacks on small screens.

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

### Reversed split hero

Media on the left at lg and up without changing DOM order.

```tsx
<Hero
  mediaPosition="left"
  eyebrow="Network overview"
  title="A fragmented market, made easier"
  description="Current activity across the network."
  media={<ProductMockup />}
/>
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

### Stacked hero

Copy above full-width media, useful for wide screenshots.

```tsx
<Hero
  variant="stacked"
  eyebrow="Product tour"
  title="Every deal in one workspace"
  description="Understand the pipeline before the first call."
  media={<DashboardScreenshot />}
/>
```

### Overlay hero

Media behind the copy; the scrim and ink invert automatically in dark mode.

```tsx
<Hero
  variant="overlay"
  align="center"
  badge="Spring cohort"
  title="Dance all night in Provo"
  description="Three rooms, one badge, live music until midnight."
  actions={<Button>Get tickets</Button>}
  media={<img src="/ballroom.jpg" alt="" />}
/>
```

## Anti-patterns

- **Don't use Hero as the only page heading twice** — A page should have one h1. Use level={2} for a second hero-like band or PageHeader for documentation pages.
- **Don't hardcode the band color** — Wrap Hero in Section and use its tone so child tokens stay readable.
- **Don't put busy media behind overlay copy** — The overlay scrim protects contrast, but high-detail media still hurts legibility. Use a calm crop and keep copy short.

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

