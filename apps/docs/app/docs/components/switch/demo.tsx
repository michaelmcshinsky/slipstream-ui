import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Label, Switch } from '@slipstream-ui/core';

export default function SwitchPage() {
  return (
    <ComponentPage
      id="switch"
      title="Switch"
      description="Toggle switch for binary settings, with role=switch and aria-checked."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'checked', type: 'boolean', description: 'Controlled on/off state.' },
        { name: 'defaultChecked', type: 'boolean', defaultValue: 'false', description: 'Initial state when uncontrolled.' },
        { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Fired when the user toggles the switch.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the switch.' },
        { name: 'aria-label', type: 'string', description: 'Accessible name when no visible label is associated.' },
      ]}
      accessibility={[
        'role="switch" with aria-checked announces on/off state.',
        'Space and Enter toggle the switch.',
        'Disabled switches are focusable-but-inert per native button semantics and announced as dimmed.',
        'Prefer a visible <Label> (htmlFor) over aria-label when space allows.',
      ]}
    >
      <DemoCard
        title="States"
        preview={
          <div className="w-full max-w-sm space-y-4">
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="sw-off">Off (default)</Label>
              <Switch id="sw-off" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="sw-on">On (defaultChecked)</Label>
              <Switch id="sw-on" defaultChecked />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="sw-disabled" className="text-muted-foreground">Disabled off</Label>
              <Switch id="sw-disabled" disabled />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="sw-disabled-on" className="text-muted-foreground">Disabled on</Label>
              <Switch id="sw-disabled-on" defaultChecked disabled />
            </div>
          </div>
        }
        code={`import { Switch } from '@slipstream-ui/core';

<Switch id="notifications" />
<Switch id="darkmode" defaultChecked />
<Switch id="maintenance" disabled />
<Switch id="beta" defaultChecked disabled />`}
        usage={`import { Switch } from '@slipstream-ui/core';

// Uncontrolled
<Switch defaultChecked onCheckedChange={(on) => savePreference(on)} />

// Controlled
<Switch checked={dark} onCheckedChange={setDark} />`}
        types={`interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}`}
      />

      <DemoCard
        title="Settings rows"
        preview={
          <div className="w-full max-w-md divide-y divide-border rounded-lg border border-border">
            {[
              { id: 'set-email', label: 'Email notifications', hint: 'Product news and digests', on: true },
              { id: 'set-push', label: 'Push notifications', hint: 'Mentions and direct messages', on: true },
              { id: 'set-sound', label: 'Sound', hint: 'Play a tone for new messages', on: false },
              { id: 'set-presence', label: 'Show online status', hint: 'Visible to your team', on: false },
            ].map((row) => (
              <div key={row.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <div>
                  <Label htmlFor={row.id} className="block">{row.label}</Label>
                  <p className="text-xs text-muted-foreground">{row.hint}</p>
                </div>
                <Switch id={row.id} defaultChecked={row.on} />
              </div>
            ))}
          </div>
        }
        code={`import { Label, Switch } from '@slipstream-ui/core';

{/* Settings rows: label + hint on the left, switch on the right */}
<div className="flex items-center justify-between gap-4 px-4 py-3">
  <div>
    <Label htmlFor="email" className="block">Email notifications</Label>
    <p className="text-xs text-muted-foreground">Product news and digests</p>
  </div>
  <Switch id="email" defaultChecked />
</div>`}
      />
    </ComponentPage>
  );
}
