import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from '@slipstream-ui/core';

export default function MenuPage() {
  return (
    <ComponentPage
      id="menu"
      title="Menu"
      description="Dropdown menu with keyboard navigation and ARIA menu semantics."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'open', type: 'boolean', description: 'Controlled open state.' },
        { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the open state changes.' },
      ]}
      accessibility={[
        'role=menu/menuitem with aria-haspopup/aria-expanded on the trigger.',
        'Arrow keys, Home/End, and Escape navigate and close the menu.',
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
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
          </div>
        }
        code="// See the examples in the props table above"
      />
    </ComponentPage>
  );
}
