import { DemoCard } from '@/components/demo-card';
import { RadioCard, RadioGroup, RadioGroupItem } from '@slipstream-ui/core';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="States"
        preview={
          <div className="w-full space-y-5">
            <RadioGroup name="demo-plan" legend="Choose a plan" defaultValue="free">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="plan-free" value="free" label="Free: 1 project" />
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="plan-pro" value="pro" label="Pro: unlimited projects" />
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="plan-team" value="team" label="Team: SSO + audit log" />
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="plan-legacy" value="legacy" label="Legacy plan (unavailable)" disabled />
                </div>
              </div>
            </RadioGroup>

            <RadioGroup name="demo-density" legend="Interface density" defaultValue="comfortable">
              <div className="flex flex-wrap gap-4">
                <RadioGroupItem id="density-comfy" value="comfortable" label="Comfortable" />
                <RadioGroupItem id="density-compact" value="compact" label="Compact" />
              </div>
            </RadioGroup>
          </div>
        }
        code={`import { RadioGroup, RadioGroupItem } from '@slipstream-ui/core';

<RadioGroup name="plan" legend="Choose a plan" defaultValue="free">
  <RadioGroupItem value="free" label="Free: 1 project" />
  <RadioGroupItem value="pro" label="Pro: unlimited projects" />
  <RadioGroupItem value="team" label="Team: SSO + audit log" />
  <RadioGroupItem value="legacy" label="Legacy plan" disabled />
</RadioGroup>

{/* Controlled */}
<RadioGroup
  name="density"
  legend="Interface density"
  value={density}
  onValueChange={setDensity}
>
  <RadioGroupItem value="comfortable" label="Comfortable" />
  <RadioGroupItem value="compact" label="Compact" />
</RadioGroup>`}
        usage={`import { RadioGroup, RadioGroupItem } from '@slipstream-ui/core';

// Uncontrolled with initial selection
<RadioGroup name="size" legend="Size" defaultValue="m">
  <RadioGroupItem value="s" label="Small" />
  <RadioGroupItem value="m" label="Medium" />
  <RadioGroupItem value="l" label="Large" />
</RadioGroup>`}
        types={`type RadioGroupProps = {
  name: string;
  legend?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

type RadioGroupItemProps = {
  value: string;
  label?: string;
  disabled?: boolean;
};`}
      />

      <DemoCard
        title="RadioCard: clickable sections (interactive)"
        preview={
          <div className="w-full max-w-2xl">
            <RadioGroup name="demo-card-plan" legend="Choose a plan" defaultValue="pro" orientation="horizontal">
              <RadioCard
                value="free"
                title="Free"
                description="1 project, community support"
                className="min-w-40 flex-1"
              />
              <RadioCard
                value="pro"
                title="Pro"
                description="Unlimited projects, priority support"
                className="min-w-40 flex-1"
              />
              <RadioCard
                value="team"
                title="Team"
                description="SSO, audit log, shared billing"
                className="min-w-40 flex-1"
              />
            </RadioGroup>
          </div>
        }
        code={`import { RadioCard, RadioGroup } from '@slipstream-ui/core';

{/* The whole section is the label; the native circle is sr-only.
    Selected state = primary border + tint via has-[:checked]. */}
<RadioGroup name="plan" legend="Choose a plan" defaultValue="pro" orientation="horizontal">
  <RadioCard value="free" title="Free" description="1 project, community support" className="flex-1" />
  <RadioCard value="pro" title="Pro" description="Unlimited projects, priority support" className="flex-1" />
  <RadioCard value="team" title="Team" description="SSO, audit log, shared billing" className="flex-1" />
</RadioGroup>`}
        usage={`import { RadioCard, RadioGroup } from '@slipstream-ui/core';

// Square corners for a tiled look
<RadioCard value="a" title="Grid" rounded={false} />

// Card body can hold custom content
<RadioCard value="b" title="Pro" description="For teams">
  <ul className="mt-2 list-inside list-disc text-xs text-muted-foreground">
    <li>Unlimited projects</li>
    <li>Priority support</li>
  </ul>
</RadioCard>`}
        types={`type RadioCardProps = {
  value: string;
  title?: string;
  description?: string;
  rounded?: boolean; // outer border radius, default true
  disabled?: boolean;
  children?: React.ReactNode; // rich card body below title/description
};`}
      />

      <DemoCard
        title="Square corners and rich card body"
        preview={
          <div className="w-full max-w-2xl">
            <RadioGroup name="demo-card-tier" legend="Choose a tier" defaultValue="pro" orientation="horizontal">
              <RadioCard value="free" title="Free" description="1 project" rounded={false} className="min-w-40 flex-1" />
              <RadioCard value="pro" title="Pro" description="For teams" rounded={false} className="min-w-56 flex-1">
                <ul className="mt-2 list-inside list-disc text-xs text-muted-foreground">
                  <li>Unlimited projects</li>
                  <li>Priority support</li>
                </ul>
              </RadioCard>
            </RadioGroup>
          </div>
        }
        code={`<RadioGroup name="tier" legend="Choose a tier" defaultValue="pro" orientation="horizontal">
  <RadioCard value="free" title="Free" rounded={false} />
  <RadioCard value="pro" title="Pro" rounded={false}>
    <ul className="mt-2 list-disc text-xs">
      <li>Unlimited projects</li>
      <li>Priority support</li>
    </ul>
  </RadioCard>
</RadioGroup>`}
      />
    </>
  );
}
