# CTASection

Full-width conversion band with eyebrow, headline, supporting copy and actions.

> Import: `import { CTASection } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/cta-section.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

Every marketing page ends with the same call-to-action band, but teams rebuild the padding, width and tone each time. CTASection standardizes the hierarchy and defaults to an inverse band.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| title | `string` | — | yes | Headline for the call to action. |
| description | `string` | — | no | Supporting copy under the headline. |
| eyebrow | `string` | — | no | Small overline above the headline. |
| actions | `ReactNode` | — | no | Buttons or links. |
| tone | `'default' | 'muted' | 'brand' | 'inverse'` | `inverse` | no | Surface treatment. |
| align | `'left' | 'center'` | `center` | no | Copy alignment. |
| size | `'sm' | 'md' | 'lg'` | `md` | no | Vertical space. |
| width | `'sm' | 'md' | 'lg' | 'xl' | 'full'` | `lg` | no | Inner container width. |

## Examples

### Default inverse CTA

A dark conversion band with one primary action.

```tsx
<CTASection
  eyebrow="Join Axial"
  title="Join the network"
  description="Connect with counterparties and close transactions."
  actions={<Button>Get started</Button>}
/>
```

### Muted CTA

A lighter band aligned to the page grid.

```tsx
<CTASection tone="muted" align="left" title="Talk to an advisor" actions={<Button>Book a call</Button>} />
```

## Anti-patterns

- **Don't stack two CTA sections** — One conversion band per page is enough. Put secondary actions in the hero or footer.

## Accessibility

- **Heading**: Renders an h2 so it sits under the page h1
- **Inverse tone**: Section scopes inverse tokens for the band

## Composition

- Compose with **Section** — CTASection renders Section internally; do not wrap it in another Section
  
  ```tsx
  <CTASection title="Ready?" actions={<Button>Start</Button>} />
  ```
- Compose with **Button** — Use one primary action and at most one secondary
  
  ```tsx
  <CTASection actions={<><Button>Start</Button><Button variant="outline">Learn more</Button></>} />
  ```
- Related: Section, Hero, Button

