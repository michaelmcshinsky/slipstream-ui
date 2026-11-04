# SiteFooter

Marketing footer: brand + tagline column, link columns and a legal bar; router-agnostic via linkComponent.

> Import: `import { SiteFooter } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/site-footer.json
> Tier: organism · Package: @slipstream-ui/core

## Design intent

Footers are copied between projects with inconsistent link handling. SiteFooter provides the standard multi-column layout, safe external links and a legal row.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| brand | `ReactNode` | — | no | Brand slot. |
| tagline | `string` | — | no | Short line under the brand. |
| columns | `SiteFooterColumn[]` | — | yes | Link columns: { title, links: { label, href, external? }[] }. |
| legal | `ReactNode` | — | no | Bottom bar (copyright, legal links). |
| linkComponent | `React.ElementType` | — | no | Router link element. |

## Examples

### Standard footer

Brand, columns and legal row.

```tsx
<SiteFooter
  brand={<img src="/logo.svg" alt="Acme" className="h-10" />}
  tagline="Ship UI your AI understands."
  columns={[{ title: 'Docs', links: [{ label: 'Intro', href: '/docs' }] }]}
  legal={<span>© 2026 Acme</span>}
/>
```

## Anti-patterns

- **Don't duplicate the same links in two columns** — Keep each destination in exactly one column for predictable scanning.

## Accessibility

- **Landmark semantics**: Renders <footer> with headed link groups

## Composition

- Compose with **SiteHeader** — Pair for a complete marketing shell
  
  ```tsx
  <SiteHeader … />…<SiteFooter … />
  ```
- Related: SiteHeader, Link, Separator

