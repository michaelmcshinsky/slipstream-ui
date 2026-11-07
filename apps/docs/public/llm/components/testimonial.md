# Testimonial

Semantic written testimonial with quote, person, role, company, avatar and logo slots.

> Import: `import { Testimonial } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/testimonial.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Review and landing pages repeat the same quote hierarchy. Testimonial uses figure, blockquote and figcaption so the attribution is real structure instead of three styled paragraphs.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| quote | `string` | — | yes | Testimonial copy without quotation marks. |
| name | `string` | — | yes | Person or company name. |
| role | `string` | — | no | Role or title. |
| company | `string` | — | no | Company name. |
| avatar | `ReactNode` | — | no | Avatar slot, usually Avatar. |
| logo | `ReactNode` | — | no | Brand or logo slot shown in the card header. |
| variant | `'card' | 'plain'` | `card` | no | Card surface or plain quote. |
| size | `'sm' | 'md' | 'lg'` | `md` | no | Quote scale. |

## Examples

### Written testimonial

A card testimonial with attribution.

```tsx
<Testimonial
  quote="The right advisor changed the outcome."
  name="Bob Falahee"
  role="CEO"
  company="Blind & Shade"
  avatar={<Avatar><AvatarFallback>BF</AvatarFallback></Avatar>}
/>
```

## Anti-patterns

- **Don't add quotation marks in the quote prop** — The component renders the quotation marks. Duplicating them produces doubled punctuation.

## Accessibility

- **Quote semantics**: Renders figure, blockquote and figcaption
- **Avatar alternative**: Avatar is a slot

## Composition

- Compose with **Grid** — Place several testimonials in a Grid for a quote wall
  
  ```tsx
  <Grid mdCols={3} gap="lg"><Testimonial ... /></Grid>
  ```
- Related: Card, Avatar, Quote, Grid

