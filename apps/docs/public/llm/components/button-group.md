# ButtonGroup

Joins buttons into one segmented control: adjacent borders collapse, middle corners square off, and only the outer corners stay rounded — a single outline around the group.

> Import: `import { ButtonGroup } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/button-group.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Related actions (view modes, zoom, toolbar steps) should read as one instrument, not scattered pills. ButtonGroup collapses adjacent borders with negative spacing so the joined outline matches InputGroup's single-border language, while focus rings lift above siblings instead of being clipped.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| orientation | `'horizontal' | 'vertical'` | `horizontal` | no | Stacked segments share vertical edges; default lays them side by side. |

## Examples

### View mode toggle

Three segments share one outline; aria-label names the group.

```tsx
<ButtonGroup aria-label="View mode">
  <Button variant="outline">List</Button>
  <Button variant="outline">Board</Button>
  <Button variant="outline">Calendar</Button>
</ButtonGroup>
```

### Vertical toolbar steps

Stacked segments share horizontal edges.

```tsx
<ButtonGroup orientation="vertical" aria-label="Step navigation">
  <Button variant="secondary">Step back</Button>
  <Button variant="secondary">Step forward</Button>
</ButtonGroup>
```

### Stepper with primary action

Mix variants freely as long as each button keeps a border.

```tsx
<ButtonGroup aria-label="Pagination steps">
  <Button variant="outline">Previous</Button>
  <Button>Next</Button>
</ButtonGroup>
```

## Anti-patterns

- **Don't use borderless variants inside** — Ghost/link buttons carry no border, so the joined outline breaks at that segment. The group's single-outline promise depends on every segment contributing an edge.
- **Don't group unrelated actions** — A joined outline asserts the segments are alternatives of one control. unrelated actions should stay separate Buttons so their relationship isn't overstated.

## Accessibility

- **Group semantics**: Renders role=group; pass aria-label (or aria-labelledby) so the group name is announced before its buttons
- **Focus visibility**: Focused segments get position:relative + z-10 so the ring paints above neighbours instead of clipping
- **Keyboard order**: Buttons keep native tab order; groups are not roving-tabindex widgets (use Tabs for that pattern)

## Composition

- Compose with **Button** — Direct children — each keeps its own variant/size but must keep a border
  
  ```tsx
  <ButtonGroup><Button variant="outline">One</Button><Button variant="outline">Two</Button></ButtonGroup>
  ```
- Compose with **Tabs** — For exclusive views with panels, use Tabs; ButtonGroup is for actions/tools, not view switching with content
  
  ```tsx
  <Tabs>…</Tabs>
  ```
- Related: Button, Tabs, Toolbar

