import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Badge, FormField, Input, Textarea } from '@slipstream-ui/core';

export default function FormFieldPage() {
  return (
    <ComponentPage
      id="form-field"
      title="FormField"
      description="Label + control + hint/error in one unit with htmlFor, aria-describedby, and aria-invalid wiring applied automatically."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'id', type: 'string', defaultValue: 'required', description: "The control's id — shared with the label's htmlFor and hint/error ids." },
        { name: 'label', type: 'string', defaultValue: 'required', description: 'Visible label text (kept for screen readers when labelHidden).' },
        { name: 'hint', type: 'string', description: 'Helper text under the control, wired via aria-describedby.' },
        { name: 'error', type: 'string', description: 'Validation error; replaces the hint, sets aria-invalid, announced via role=alert.' },
        { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Renders the required marker next to the label.' },
        { name: 'labelHidden', type: 'boolean', defaultValue: 'false', description: 'Keeps the label sr-only while hiding it visually.' },
        { name: 'labelPlacement', type: "'top' | 'left'", defaultValue: "'top'", description: 'Stack the label above the control or inline it to the left (fixed label column).' },
        { name: 'tooltip', type: 'string', description: 'Info icon rendered after the label; opens a tooltip with this text.' },
        { name: 'trailing', type: 'ReactNode', description: "Slot pinned to the far right of the label row (badge, link, action)." },
        { name: 'children', type: 'ReactNode', description: 'Exactly one control element — id/aria wiring is cloned onto it.' },
      ]}
      accessibility={[
        'Label pairs via htmlFor/id automatically.',
        'aria-describedby points at the hint — or the error when one is present.',
        'Errors render with role=alert and flip aria-invalid on the control.',
        'The required asterisk is aria-hidden; native required comes from the control itself.',
      ]}
      browserNotes={[
        'id/aria cloning and role=alert are plain DOM — works in every supported browser.',
      ]}
    >
      <DemoCard
        title="Hint & error states"
        preview={
          <div className="w-full max-w-md space-y-5">
            <FormField id="ff-email" label="Email address" hint="We never share your email" required>
              <Input type="email" placeholder="you@example.com" autoComplete="email" />
            </FormField>
            <FormField
              id="ff-password"
              label="Password"
              error="Password must be at least 8 characters"
              required
            >
              <Input type="password" defaultValue="short" />
            </FormField>
            <FormField id="ff-bio" label="Short bio" hint="Max 280 characters" labelHidden>
              <Textarea placeholder="Visible label is hidden — click here to hear it read" maxLength={280} />
            </FormField>
          </div>
        }
        code={`import { FormField, Input, Textarea } from '@slipstream-ui/core';

{/* Hint state — aria-describedby points at the hint */}
<FormField id="email" label="Email address" hint="We never share your email" required>
  <Input type="email" autoComplete="email" />
</FormField>

{/* Error state — hint is replaced, aria-invalid is set, role=alert announces */}
<FormField id="password" label="Password" error="Password must be at least 8 characters" required>
  <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
</FormField>

{/* Hidden visual label (sr-only) */}
<FormField id="bio" label="Short bio" labelHidden>
  <Textarea maxLength={280} />
</FormField>`}
        usage={`import { FormField, Input } from '@slipstream-ui/core';

// Controlled error state from your validation
<FormField id="email" label="Email" error={errors.email} required>
  <Input value={email} onChange={(e) => setEmail(e.target.value)} />
</FormField>`}
        types={`type FormFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  labelHidden?: boolean;
  children: React.ReactNode;
};`}
      />

      <DemoCard
        title="A small form"
        preview={
          <div className="w-full max-w-md space-y-4 rounded-xl border border-border bg-card p-5">
            <FormField id="ff-name" label="Full name" required>
              <Input autoComplete="name" placeholder="Ada Lovelace" />
            </FormField>
            <FormField id="ff-org" label="Organization" hint="Optional — used on invoices">
              <Input placeholder="Analytical Engines Inc." />
            </FormField>
            <FormField id="ff-website" label="Website" error="Enter a valid URL (https://…)">
              <Input type="url" defaultValue="not-a-url" />
            </FormField>
            <button
              type="button"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Save profile
            </button>
          </div>
        }
        code={`import { FormField, Input } from '@slipstream-ui/core';

<form className="space-y-4">
  <FormField id="name" label="Full name" required>
    <Input autoComplete="name" />
  </FormField>
  <FormField id="org" label="Organization" hint="Optional — used on invoices">
    <Input />
  </FormField>
  <FormField id="website" label="Website" error={errors.website}>
    <Input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} />
  </FormField>
  <button type="submit">Save profile</button>
</form>`}
      />

      <DemoCard
        title="Label placement, tooltip, trailing slot"
        preview={
          <div className="w-full space-y-6">
            <FormField
              id="ff-tooltip"
              label="Work email"
              tooltip="Use your work email so teammates can find you in the directory."
              hint="We never share your email."
              required
            >
              <Input type="email" placeholder="you@company.com" />
            </FormField>

            <FormField
              id="ff-left"
              label="API key"
              labelPlacement="left"
              labelHidden={false}
              hint="Rotated automatically every 90 days."
              trailing={
                <Badge variant="outline" className="whitespace-nowrap">
                  rotates in 90d
                </Badge>
              }
            >
              <Input defaultValue="sk_live_••••4f2a" readOnly />
            </FormField>

            <FormField
              id="ff-left-plain"
              label="Environment"
              labelPlacement="left"
              tooltip="Where deploys are released."
            >
              <Input defaultValue="production" />
            </FormField>
          </div>
        }
        code={`import { Badge, FormField, Input } from '@slipstream-ui/core';

{/* Info icon beside the label opens a tooltip */}
<FormField
  id="email"
  label="Work email"
  tooltip="Use your work email so teammates can find you."
  hint="We never share your email."
  required
>
  <Input type="email" />
</FormField>

{/* Inline label column + trailing slot on the right of the row */}
<FormField
  id="key"
  label="API key"
  labelPlacement="left"
  hint="Rotated automatically every 90 days."
  trailing={<Badge variant="outline">rotates in 90d</Badge>}
>
  <Input readOnly value="sk_live_••••4f2a" />
</FormField>`}
        usage={`import { FormField, Input } from '@slipstream-ui/core';

// Compact settings rows read better with the label on the left
<FormField id="env" label="Environment" labelPlacement="left" tooltip="Where deploys go.">
  <Input defaultValue="production" />
</FormField>`}
        types={`type FormFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  labelHidden?: boolean;
  labelPlacement?: 'top' | 'left';
  tooltip?: string;
  trailing?: ReactNode;
};`}
      />
    </ComponentPage>
  );
}
