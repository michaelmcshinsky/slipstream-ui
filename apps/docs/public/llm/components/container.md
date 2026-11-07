# Container

Centered, width-constrained page container with shared gutters and four width presets.

> Import: `import { Container } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/container.json
> Tier: atom · Package: @slipstream-ui/core

## Design intent

Pages repeat the same mx-auto/max-w/px trio with slightly different values. Container makes the content width and gutters a shared decision so headers, marketing sections and app pages line up.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| width | `'sm' | 'md' | 'lg' | 'xl' | 'full'` | `lg` | no | Maximum content width. lg is 80rem (1280px); xl is 1400px; full removes the cap. |
| padding | `'none' | 'sm' | 'md' | 'lg'` | `md` | no | Horizontal gutters. md is px-4 / sm:px-6; lg adds lg:px-8. |
| as | `'div' | 'section' | 'article' | 'header' | 'footer' | 'main' | 'nav'` | `div` | no | Semantic element to render. |

## Examples

### Page container

Shared width and gutters for a page header and its content.

```tsx
<Container width="lg" padding="lg">
  <PageHeader title="Deals" />
</Container>
```

## Anti-patterns

- **Don't nest same-width containers** — A Container inside a Container doubles the gutters on narrow screens. Use Section's inner container once.

## Accessibility

- **Semantic element**: The as prop renders div/section/article/header/footer/main/nav

## Composition

- Compose with **Section** — Section renders a Container internally; use Container directly only for custom chrome
  
  ```tsx
  <Section width="lg"><Hero /></Section>
  ```
- Related: Section, Block, Grid

