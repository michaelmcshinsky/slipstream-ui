import { DemoCard } from '@/components/demo-card';
import { Checkbox, CheckboxGroup, CheckboxGroupItem, Label } from '@slipstream-ui/core';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="States"
        preview={
          <div className="w-full space-y-4">
            <div className="flex items-center gap-2">
              <Checkbox id="cb-unchecked" aria-label="Unchecked" />
              <Label htmlFor="cb-unchecked">Unchecked</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cb-checked" defaultChecked aria-label="Checked" />
              <Label htmlFor="cb-checked">Checked (defaultChecked)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cb-disabled" disabled aria-label="Disabled unchecked" />
              <Label htmlFor="cb-disabled" className="text-muted-foreground">Disabled</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cb-disabled-checked" defaultChecked disabled aria-label="Disabled checked" />
              <Label htmlFor="cb-disabled-checked" className="text-muted-foreground">Disabled + checked</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cb-required" required aria-label="Required agreement" />
              <Label htmlFor="cb-required">
                Required <span className="text-destructive">*</span>
              </Label>
            </div>
          </div>
        }
        code={`import { Checkbox, CheckboxGroup, CheckboxGroupItem, Label } from '@slipstream-ui/core';

<Checkbox id="c1" />
<Checkbox id="c2" defaultChecked />
<Checkbox id="c3" disabled />
<Checkbox id="c4" defaultChecked disabled />
<Checkbox id="c5" required />

{/* Always associate a label (or aria-label) */}
<Label htmlFor="c1">Unchecked</Label>`}
        usage={`import { Checkbox, CheckboxGroup, CheckboxGroupItem, Label } from '@slipstream-ui/core';

// Uncontrolled
<Checkbox id="terms" defaultChecked onCheckedChange={(v) => console.log(v)} />

// Controlled
<Checkbox checked={agreed} onCheckedChange={setAgreed} />`}
        types={`type CheckboxProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
};`}
      />

      <DemoCard
        title="Form groups"
        preview={
          <fieldset className="w-full max-w-sm space-y-3 border-0 p-0">
            <legend className="mb-1 text-sm font-medium">Notification preferences</legend>
            <div className="flex items-center gap-2">
              <Checkbox id="cb-product" name="notify" value="product" defaultChecked />
              <Label htmlFor="cb-product">Product updates</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cb-security" name="notify" value="security" defaultChecked />
              <Label htmlFor="cb-security">Security alerts (recommended)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="cb-tips" name="notify" value="tips" />
              <Label htmlFor="cb-tips">Tips &amp; tricks</Label>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <Checkbox id="cb-terms" name="terms" value="accepted" />
              <Label htmlFor="cb-terms">I accept the terms and conditions</Label>
            </div>
          </fieldset>
        }
        code={`import { Checkbox, CheckboxGroup, CheckboxGroupItem, Label } from '@slipstream-ui/core';

{/* name + value make the group part of a native form submission */}
<fieldset>
  <legend>Notification preferences</legend>
  <div className="flex items-center gap-2">
    <Checkbox id="product" name="notify" value="product" defaultChecked />
    <Label htmlFor="product">Product updates</Label>
  </div>
  <div className="flex items-center gap-2">
    <Checkbox id="security" name="notify" value="security" defaultChecked />
    <Label htmlFor="security">Security alerts (recommended)</Label>
  </div>
</fieldset>`}
      />
      <DemoCard
        title="CheckboxGroup"
        preview={
          <CheckboxGroup
            name="channels-demo"
            legend="Delivery channels"
            orientation="horizontal"
            defaultValue={['email']}
          >
            <CheckboxGroupItem value="email" label="Email" />
            <CheckboxGroupItem value="sms" label="SMS" />
            <CheckboxGroupItem value="push" label="Push" disabled />
          </CheckboxGroup>
        }
        code={`<CheckboxGroup
  name="channels"
  legend="Delivery channels"
  orientation="horizontal"
  value={channels}
  onValueChange={setChannels}
>
  <CheckboxGroupItem value="email" label="Email" />
  <CheckboxGroupItem value="sms" label="SMS" />
  <CheckboxGroupItem value="push" label="Push" disabled />
</CheckboxGroup>`}
        usage={`// CheckboxGroup owns the fieldset/legend and the string[] value;
// CheckboxGroupItem takes value + label. Use plain Checkbox + Label pairs
// when layout needs full control.`}
      />
    </>
  );
}
