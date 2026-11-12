# Accordion

Collapsible content sections with ARIA accordion semantics and keyboard navigation

> Import: `import { Accordion } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/accordion.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Accordion organizes content into expandable sections, reducing visual density on pages with lots of content. Each trigger announces its expanded state and controls its panel.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| value | `string[]` | — | no | Controlled open item ids |
| defaultValue | `string[]` | — | no | Initial open item ids when uncontrolled |
| onValueChange | `(value: string[]) => void` | — | no | Called when the open set changes |
| collapsible | `boolean` | `true` | no | When true, opening an item closes the others |
| children | `ReactNode` | — | yes | AccordionItem children |
| className | `string` | — | no | Additional CSS classes to apply |
| icon | `ReactNode` | — | no | AccordionTrigger only: replace the default chevron rendered at the far right of the header. |
| variant | `'default' | 'borderless'` | `default` | no | 'default' = bordered card with dividers; 'borderless' = plain stacked sections. |
| gap | `'none' | 'sm' | 'md' | 'lg' | 'xl' | number` | — | no | Token gap ('lg') or exact pixels (16) between items. |
| items | `AccordionSection[]` | — | no | Declarative sections ({ id, title, content, disabled }); rendered as an AccordionItem per entry instead of children. |

## Examples

### FAQ accordion

Single-open accordion for FAQs

```tsx
<Accordion defaultValue={['a']}>
  <AccordionItem id="a">
    <AccordionTrigger>What is Slipstream?</AccordionTrigger>
    <AccordionContent>An AI-first component system.</AccordionContent>
  </AccordionItem>
  <AccordionItem id="b">
    <AccordionTrigger>How do I install?</AccordionTrigger>
    <AccordionContent>Run npx slipstream-ui init.</AccordionContent>
  </AccordionItem>
</Accordion>
```

## Anti-patterns

- **Don't use Accordion for primary navigation** — Accordion is for content disclosure. Use Tabs or a nav menu for page-level navigation.
- **Don't hide required information behind a collapsed panel** — Users may not discover it. Put critical content in the open by default.

## Accessibility

- **Accordion semantics**: Trigger has aria-expanded and aria-controls; panel has role=region and aria-labelledby
- **Keyboard support**: Enter/Space toggle; hidden panels are removed from tab order

## Composition

- Compose with **AccordionItem** — Wrap each section in an AccordionItem with a unique id
  
  ```tsx
  <AccordionItem id="x"><AccordionTrigger>...</AccordionTrigger><AccordionContent>...</AccordionContent></AccordionItem>
  ```
- Related: Tabs, Card

