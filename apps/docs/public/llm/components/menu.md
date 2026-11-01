# Menu

Dropdown menu with keyboard navigation, typeahead, and ARIA menu semantics

> Import: `import { Menu } from '@slipstream-ui/core'`
> Registry: https://slipstreamui.com/registry/menu.json
> Tier: molecule · Package: @slipstream-ui/core

## Design intent

Menu presents a list of actions in a floating panel anchored to a trigger. Supports arrow-key navigation, Home/End, Escape to close, and destructive item styling.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| open | `boolean` | — | no | Controlled open state |
| onOpenChange | `(open: boolean) => void` | — | no | Called when the open state changes |
| children | `ReactNode` | — | yes | MenuTrigger and MenuContent children |
| className | `string` | — | no | Additional CSS classes to apply |
| destructive | `boolean` | `false` | no | Renders the item in a destructive style (MenuItem component) |

## Examples

### Actions menu

Dropdown with labeled actions and a destructive item

```tsx
<Menu>
  <MenuTrigger>Options</MenuTrigger>
  <MenuContent>
    <MenuLabel>Actions</MenuLabel>
    <MenuItem>Profile</MenuItem>
    <MenuItem>Settings</MenuItem>
    <MenuSeparator />
    <MenuItem destructive>Sign out</MenuItem>
  </MenuContent>
</Menu>
```

## Anti-patterns

- **Don't use Menu for navigation** — Menu is for actions. Use links or a navigation menu for page navigation.
- **Don't put forms inside a Menu** — Menus close on interaction. Use a Popover or Dialog for form inputs.

## Accessibility

- **Menu semantics**: role=menu on the panel, role=menuitem on items, aria-haspopup/aria-expanded on the trigger
- **Keyboard navigation**: Arrow keys move between items, Home/End jump to ends, Escape closes
- **Focus management**: Focus moves to items on arrow navigation and returns to trigger on close

## Composition

- Compose with **MenuTrigger** — Every Menu needs a MenuTrigger
  
  ```tsx
  <MenuTrigger>Options</MenuTrigger>
  ```
- Compose with **MenuItem** — Items are keyboard-navigable and close the menu on select
  
  ```tsx
  <MenuItem onClick={handleDelete} destructive>Delete</MenuItem>
  ```
- Related: Tooltip, Dialog

