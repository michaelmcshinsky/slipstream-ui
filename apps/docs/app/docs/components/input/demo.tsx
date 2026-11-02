import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Input, Label } from '@slipstream-ui/core';

export default function InputPage() {
  return (
    <ComponentPage
      id="input"
      title="Input"
      description="A text input field with support for various input types and standard HTML input attributes."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'type', type: 'HTML input type', defaultValue: "'text'", description: 'Any native input type: text, email, password, number, tel, url, search, date, time, file…' },
        { name: 'placeholder', type: 'string', defaultValue: 'undefined', description: 'Placeholder text (never a label substitute).' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input.' },
        { name: 'readOnly', type: 'boolean', defaultValue: 'false', description: 'Renders the value read-only (still focusable).' },
        { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Marks the input as required for form validation.' },
        { name: 'aria-invalid', type: 'boolean', defaultValue: 'false', description: 'Announces validation failure; pair with aria-describedby error text.' },
        { name: 'autoComplete', type: 'string', defaultValue: 'undefined', description: 'HTML autofill hint (e.g. "email", "new-password", "one-time-code").' },
      ]}
      accessibility={[
        'Full keyboard navigation support',
        'Screen reader announces input type and placeholder',
        'Disabled state is properly announced',
        'Visible focus indicator for keyboard users',
        'Supports HTML5 validation attributes (required, pattern, minLength…)',
        'Pair every input with a <Label>; use aria-describedby for hints and errors',
      ]}
    >
      <DemoCard
        title="Native input types"
        preview={
          <div className="w-full max-w-md space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="in-text">Text</Label>
              <Input id="in-text" placeholder="Ada Lovelace" autoComplete="name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="in-email">Email</Label>
              <Input id="in-email" type="email" placeholder="user@example.com" autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="in-password">Password</Label>
              <Input id="in-password" type="password" placeholder="At least 8 characters" autoComplete="new-password" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="in-number">Number</Label>
                <Input id="in-number" type="number" min={0} max={100} defaultValue={10} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="in-tel">Phone</Label>
                <Input id="in-tel" type="tel" placeholder="+1 555 0100" autoComplete="tel" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="in-url">URL</Label>
                <Input id="in-url" type="url" placeholder="https://slipstreamui.com" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="in-search">Search</Label>
                <Input id="in-search" type="search" placeholder="Search components…" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="in-date">Date</Label>
                <Input id="in-date" type="date" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="in-time">Time</Label>
                <Input id="in-time" type="time" />
              </div>
            </div>
          </div>
        }
        code={`import { Input, Label } from '@slipstream-ui/core';

{/* Every native input type passes straight through */}
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" autoComplete="email" />

<Input type="password" autoComplete="new-password" />
<Input type="number" min={0} max={100} />
<Input type="tel" autoComplete="tel" />
<Input type="url" placeholder="https://…" />
<Input type="search" placeholder="Search…" />
<Input type="date" />
<Input type="time" />`}
      />

      <DemoCard
        title="States"
        preview={
          <div className="w-full max-w-md space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="st-placeholder">With placeholder</Label>
              <Input id="st-placeholder" placeholder="Placeholder only shows when empty" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="st-disabled">Disabled</Label>
              <Input id="st-disabled" disabled value="Cannot edit me" readOnly />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="st-readonly">Read-only</Label>
              <Input id="st-readonly" readOnly value="Read-only value" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="st-required">
                Required <span className="text-destructive">*</span>
              </Label>
              <Input id="st-required" required aria-describedby="st-required-hint" />
              <p id="st-required-hint" className="text-xs text-muted-foreground">
                We never share your email.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="st-invalid">Invalid (aria-invalid)</Label>
              <Input
                id="st-invalid"
                type="email"
                value="not-an-email"
                readOnly
                aria-invalid="true"
                aria-describedby="st-error"
                className="border-destructive focus-visible:ring-destructive"
              />
              <p id="st-error" className="text-xs text-destructive">
                Enter a valid email address.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="st-limit">With constraints</Label>
              <Input id="st-limit" maxLength={20} pattern="[A-Za-z]+" placeholder="Letters only, max 20" />
            </div>
          </div>
        }
        code={`import { Input, Label } from '@slipstream-ui/core';

<Input disabled />
<Input readOnly value="Fixed" />
<Input required aria-describedby="hint" />

{/* Invalid state: aria-invalid + describedby + destructive ring */}
<Input
  type="email"
  value="not-an-email"
  aria-invalid="true"
  aria-describedby="email-error"
  className="border-destructive focus-visible:ring-destructive"
/>
<p id="email-error" className="text-xs text-destructive">Enter a valid email.</p>

{/* Native constraints pass through */}
<Input maxLength={20} pattern="[A-Za-z]+" />`}
      />
    </ComponentPage>
  );
}
