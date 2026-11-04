# Tabs

Tabbed content container with ARIA tablist semantics and keyboard navigation

> Import: `import { Tabs } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/tabs.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Tabs organize related content into switchable panels. Tabs manages the active tab, wires ARIA relationships, and uses roving tabindex so keyboard users move through tabs with arrow keys.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| value | `string` | — | no | Controlled active tab value |
| defaultValue | `string` | — | no | Initial tab value when uncontrolled |
| onValueChange | `(value: string) => void` | — | no | Called when the active tab changes |
| children | `ReactNode` | — | yes | TabsList, TabsTrigger, and TabsContent children |
| className | `string` | — | no | Additional CSS classes to apply |
| variant | `'default' | 'underline' | 'rounded'` | `default` | no | Strip design: enclosed pill track (default), background-free underline, or fully-rounded pill track. |
| size | `'sm' | 'md' | 'lg'` | `md` | no | Density for the strip and its triggers. |

## Examples

### Basic tabs

Two-tab layout with panels

```tsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Overview panel</TabsContent>
  <TabsContent value="analytics">Analytics panel</TabsContent>
</Tabs>
```

### Controlled tabs

Tabs driven by parent state

```tsx
<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="one">One</TabsTrigger>
    <TabsTrigger value="two">Two</TabsTrigger>
  </TabsList>
  <TabsContent value="one">Panel one</TabsContent>
  <TabsContent value="two">Panel two</TabsContent>
</Tabs>
```

## Anti-patterns

- **Don't use Tabs for primary navigation** — Tabs switch content within a view. Use links or a navigation menu for moving between pages.
- **Don't nest Tabs more than one level deep** — Nested tabs disorient users; use sections or accordions instead.

## Accessibility

- **Tablist semantics**: role=tablist/tab/tabpanel with aria-selected and aria-controls
- **Roving tabindex**: Only the active tab is tabbable; arrow keys move between tabs

## Composition

- Compose with **TabsList** — Wrap triggers in a TabsList for correct semantics
  
  ```tsx
  <TabsList><TabsTrigger value="a">A</TabsTrigger></TabsList>
  ```
- Related: Separator, Button

