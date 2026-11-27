# LogoCloud

Trust strip for member, customer or partner logos with captions, columns and optional links.

> Component ID: `logo-cloud`
> Import: `import { LogoCloud } from '@slipstream-ui/core'`
> Docs: https://slipstreamui.com/docs/components/logo-cloud
> Registry: https://slipstreamui.com/registry/logo-cloud.json
> Tier: molecule · Package: @slipstream-ui/core@0.11.7
> Manifest schema: v1 · manifest: v1

## Design intent

Proof logos are repeated on every marketing page with inconsistent sizing, spacing and alt text. LogoCloud makes the strip a named list, keeps the logos decorative and supplies the accessible name once.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| items | `LogoItem[]` | — | yes | Logos to display: accessible name, decorative artwork and optional href. |
| caption | `string` | — | no | Caption above the strip. |
| columns | `3 | 4 | 5 | 6` | `4` | no | Desktop column count. |
| grayscale | `boolean` | `true` | no | Desaturate logos until hover. |
| size | `'sm' | 'md' | 'lg'` | `md` | no | Logo box height. |
| align | `'left' | 'center'` | `center` | no | Caption and grid alignment. |
| linkComponent | `React.ElementType` | — | no | Custom link element for routers. |
| linkHrefProp | `'href' | 'to'` | `'href'` | no | Prop used to pass the destination to linkComponent ('to' for react-router style routers). |

## Examples

### Member logo strip

Decorative logo art with the name supplied as accessible text.

```tsx
<LogoCloud
  caption="Trusted across the lower middle market"
  items={[
    { name: 'Peakstone', logo: <img src="/peakstone.svg" alt="" /> },
    { name: 'North', logo: <img src="/north.svg" alt="" />, href: '/members/north' },
  ]}
/>
```

## Anti-patterns

- **Don't duplicate the name in alt text** — LogoCloud already renders the item name for assistive tech. Mark the image decorative so screen readers announce it once.

## Accessibility

- **Named logo list**: Each item is a list item with an sr-only name; logo artwork is aria-hidden
- **Optional links**: Linked logos render as a single focusable link named by the item

## Composition

- Compose with **Section** — Place LogoCloud inside a Section so the band controls tone and spacing
  
  ```tsx
  <Section tone="muted"><LogoCloud items={logos} /></Section>
  ```
- Related: Section, Testimonial, StatBand

