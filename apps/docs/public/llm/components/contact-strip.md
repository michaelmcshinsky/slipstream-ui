# ContactStrip

Compact labelled contact rows with optional icons and links.

> Import: `import { ContactStrip } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/contact-strip.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Marketing footers and contact sections repeat phone, email and address rows. ContactStrip keeps the label/value pairing consistent and gives phone and email links the right destination.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| items | `ContactItem[]` | — | yes | Contact rows: label, value, optional href and icon. |
| columns | `2 | 3` | `2` | no | Desktop column count. |
| align | `'left' | 'center'` | `left` | no | Row alignment. |
| linkComponent | `React.ElementType` | — | no | Custom link element for routers. |

## Examples

### Contact details

Phone and email rows with links.

```tsx
<ContactStrip
  items={[
    { label: 'Call', value: '1.800.860.4519', href: 'tel:18008604519' },
    { label: 'Email', value: 'info@axial.net', href: 'mailto:info@axial.net' },
  ]}
/>
```

## Anti-patterns

- **Don't use a bare URL as the label** — The label should name the channel (Call, Email, Address), not repeat the value.

## Accessibility

- **List semantics**: Renders ul/li with a label and a value per row
- **Contact links**: Phone uses tel: and email uses mailto: when provided

## Composition

- Compose with **SiteFooter** — Place ContactStrip in the footer contact column
  
  ```tsx
  <SiteFooter columns={columns} />
  ```
- Related: SiteFooter, Link, Text

