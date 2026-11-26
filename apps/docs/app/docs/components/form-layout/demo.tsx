import { DemoCard } from '@/components/demo-card';
import { Button, FormField, FormLayout, Input } from '@slipstream-ui/core';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Grid (2 columns)"
        preview={
          <div className="w-full max-w-lg">
            <FormLayout layout="grid" columns={2} gap={16} as="fieldset" legend="Profile" description="Two-up layout for short fields">
              <FormField id="fl-first" label="First name">
                <Input defaultValue="Ada" />
              </FormField>
              <FormField id="fl-last" label="Last name">
                <Input defaultValue="Lovelace" />
              </FormField>
              <FormField id="fl-email" label="Email">
                <Input type="email" defaultValue="user@example.com" />
              </FormField>
              <FormField id="fl-org" label="Organization">
                <Input defaultValue="Analytical Engines" />
              </FormField>
            </FormLayout>
          </div>
        }
        code={`import { FormLayout, FormField, Input } from '@slipstream-ui/core';

{/* Two-up grid inside a named fieldset; exact 16px rhythm */}
<FormLayout layout="grid" columns={2} gap={16} as="fieldset" legend="Profile" description="Two-up layout for short fields">
  <FormField id="first" label="First name"><Input defaultValue="Ada" /></FormField>
  <FormField id="last" label="Last name"><Input defaultValue="Lovelace" /></FormField>
  <FormField id="email" label="Email"><Input type="email" /></FormField>
  <FormField id="org" label="Organization"><Input /></FormField>
</FormLayout>`}
        usage={`// Even stack (default) with a token gap
<FormLayout gap="lg">…</FormLayout>

// Horizontal action row
<FormLayout layout="row" gap="sm">…</FormLayout>

// 4-column dense grid
<FormLayout layout="grid" columns={4} gap="md">…</FormLayout>`}
        types={`type FormLayoutProps = {
  layout?: 'stack' | 'row' | 'grid';
  columns?: 1 | 2 | 3 | 4 | { base?: 1|2|3|4; sm?: 1|2|3|4; md?: 1|2|3|4; lg?: 1|2|3|4; xl?: 1|2|3|4 };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | number;
  legend?: string;
  legendClassName?: string;
  description?: string;
  descriptionClassName?: string;
  as?: 'div' | 'fieldset';
};`}
      />

      <DemoCard
        title="Stack and row"
        preview={
          <div className="w-full max-w-lg space-y-5">
            <FormLayout layout="stack" gap="sm" className="rounded-lg border border-border p-4">
              <FormField id="fl-stack-a" label="Webhook URL">
                <Input placeholder="https://…" />
              </FormField>
              <FormField id="fl-stack-b" label="Signing secret">
                <Input type="password" defaultValue="whsec_••••" />
              </FormField>
            </FormLayout>

            <FormLayout layout="row" gap="sm" as="fieldset" legend="Add a member">
              <FormField id="fl-row-email" label="Email" className="flex-1">
                <Input type="email" placeholder="teammate@company.com" />
              </FormField>
              <Button type="button">Invite</Button>
            </FormLayout>
          </div>
        }
        code={`{/* Stack: even vertical rhythm (token gap) */}
<FormLayout layout="stack" gap="sm">…</FormLayout>

{/* Row: fields and actions on one aligned line */}
<FormLayout layout="row" gap="sm" as="fieldset" legend="Add a member">
  <FormField id="email" label="Email" className="flex-1">
    <Input type="email" />
  </FormField>
  <Button type="button">Invite</Button>
</FormLayout>`}
      />
    </>
  );
}
