import { DemoCard } from '@/components/demo-card';
import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from '@slipstream-ui/core';

export default function Demo() {
  return (
    <>
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
        code={"import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from '@slipstream-ui/core';\n\nexport default function Example() {\n  return (\n    <>\n      <Menu>\n          <MenuTrigger>Options</MenuTrigger>\n          <MenuContent>\n            <MenuLabel>Actions</MenuLabel>\n            <MenuItem>Profile</MenuItem>\n            <MenuItem>Settings</MenuItem>\n            <MenuSeparator />\n            <MenuItem destructive>Sign out</MenuItem>\n          </MenuContent>\n        </Menu>\n    </>\n  );\n}"}
        usage={"import { Menu, MenuContent, MenuItem, MenuTrigger } from '@slipstream-ui/core';\n\n// Menu is a compound component: trigger + content\n<Menu>\n  <MenuTrigger>Options</MenuTrigger>\n  <MenuContent>\n    <MenuItem>Profile</MenuItem>\n  </MenuContent>\n</Menu>"}
        types={"type MenuProps = {\n  open?: boolean;\n  onOpenChange?: (open: boolean) => void;\n  className?: string;\n  children: React.ReactNode;\n};"}
      />

      <DemoCard
        title="Sections, icons, and destructive actions"
        preview={
          <div className="flex w-full flex-wrap gap-6">
            <Menu>
              <MenuTrigger>Account</MenuTrigger>
              <MenuContent className="w-56">
                <MenuLabel>Signed in as user@example.com</MenuLabel>
                <MenuItem>Profile</MenuItem>
                <MenuItem>Keyboard shortcuts</MenuItem>
                <MenuSeparator />
                <MenuLabel>Workspace</MenuLabel>
                <MenuItem>Settings</MenuItem>
                <MenuItem>Billing</MenuItem>
                <MenuSeparator />
                <MenuItem destructive>Sign out</MenuItem>
              </MenuContent>
            </Menu>

            <Menu>
              <MenuTrigger>Row actions ▾</MenuTrigger>
              <MenuContent className="w-48">
                <MenuItem>Duplicate</MenuItem>
                <MenuItem>Move to…</MenuItem>
                <MenuItem>Rename</MenuItem>
                <MenuSeparator />
                <MenuItem destructive>Delete project</MenuItem>
              </MenuContent>
            </Menu>
          </div>
        }
        code={`import { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from '@slipstream-ui/core';

{/* Grouped account menu with destructive foot */}
<Menu>
  <MenuTrigger>Account</MenuTrigger>
  <MenuContent className="w-56">
    <MenuLabel>Signed in as user@example.com</MenuLabel>
    <MenuItem>Profile</MenuItem>
    <MenuItem>Keyboard shortcuts</MenuItem>
    <MenuSeparator />
    <MenuLabel>Workspace</MenuLabel>
    <MenuItem>Settings</MenuItem>
    <MenuSeparator />
    <MenuItem destructive>Sign out</MenuItem>
  </MenuContent>
</Menu>

{/* Width and content are yours via className + composition */}
<Menu>
  <MenuTrigger>Row actions</MenuTrigger>
  <MenuContent className="w-48">
    <MenuItem>Duplicate</MenuItem>
    <MenuItem>Move to…</MenuItem>
    <MenuSeparator />
    <MenuItem destructive>Delete project</MenuItem>
  </MenuContent>
</Menu>`}
        types={`type MenuProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

// MenuContent: className for width, MenuLabel/MenuSeparator for grouping,
// MenuItem: { destructive?: boolean } for risky actions.`}
      />
    </>
  );
}
