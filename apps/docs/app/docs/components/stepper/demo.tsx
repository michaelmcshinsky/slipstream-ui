'use client';

import { useState } from 'react';
import { Button, Stepper } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

const STEPS = [
  { label: 'Account', description: 'Email and password' },
  { label: 'Studio', description: 'Name and timezone' },
  { label: 'Invite team' },
  { label: 'Review' },
];

const SHORT_STEPS = [
  { label: 'Account' },
  { label: 'Studio' },
  { label: 'Invite team' },
  { label: 'Review' },
];

const TIMELINE_STEPS = [
  { label: 'Submitted', description: 'Mar 2 · Application received' },
  { label: 'Under review', description: 'Mar 4 · Panel scoring' },
  { label: 'Decision', description: 'Mar 9 · Offer sent' },
  { label: 'Onboarding' },
];

const PROPS_ROWS = [
  { name: 'steps', type: '{ label: string; description?: string }[]', defaultValue: 'required', description: 'Ordered step definitions.' },
  { name: 'current', type: 'number', defaultValue: 'required', description: 'Zero-based index of the active step.' },
  { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: 'Layout direction.' },
  { name: 'variant', type: "'numbered' | 'dots'", defaultValue: "'numbered'", description: 'Numbered markers with a check when complete, or compact dots.' },
  { name: 'size', type: "'sm' | 'md'", defaultValue: "'md'", description: 'Marker and label scale.' },
  { name: 'labelPlacement', type: "'inline' | 'below'", defaultValue: "'inline'", description: 'Horizontal only: label beside or beneath the marker.' },
  { name: 'alignTitles', type: "'start' | 'center'", defaultValue: "'center'", description: 'Center a title against its marker when the step has no description.' },
  { name: 'onStepClick', type: '(index: number) => void', description: 'Makes steps clickable (revisit flows).' },
];

export default function StepperPage() {
  const [step, setStep] = useState(1);
  const [belowStep, setBelowStep] = useState(2);
  const [verticalStep, setVerticalStep] = useState(1);

  return (
    <ComponentPage
      id="stepper"
      title="Stepper"
      description="Multi-step flow indicator: ordered list, aria-current step, text state, horizontal or vertical, numbered or dots."
      npmPackages="@slipstream-ui/core"
      propsRows={PROPS_ROWS}
      accessibility={[
        'Ordered list semantics; the active step carries aria-current="step".',
        'Complete/current/upcoming are stated in screen-reader text, not only color.',
        'Titles without a description are centred against the marker; titles with one stay top aligned.',
        'Clickable steps are real buttons with a visible focus ring.',
      ]}
    >
      <div className="space-y-8">
        <DemoCard
          title="Onboarding wizard (interactive)"
          preview={
            <div className="w-full space-y-6">
              <Stepper current={step} steps={STEPS} onStepClick={setStep} />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                  Back
                </Button>
                <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} disabled={step === STEPS.length - 1}>
                  Next
                </Button>
              </div>
            </div>
          }
          code={`const [step, setStep] = useState(0);

<Stepper
  current={step}
  steps={[
    { label: 'Account', description: 'Email and password' },
    { label: 'Studio', description: 'Name and timezone' },
    { label: 'Invite team' },
    { label: 'Review' },
  ]}
  onStepClick={setStep}
/>`}
          usage={`// onStepClick makes completed/upcoming steps clickable for revisit flows;
// omit it for strictly linear wizards. Use Progress instead when the
// progress is a percentage rather than discrete stages.`}
          types={`type StepperProps = {
  steps: { label: string; description?: string }[];
  current: number;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'numbered' | 'dots';
  size?: 'sm' | 'md';
  labelPlacement?: 'inline' | 'below';
  alignTitles?: 'start' | 'center';
  onStepClick?: (index: number) => void;
};`}
        />

        <DemoCard
          title="Labels below the markers"
          preview={
            <div className="w-full space-y-5">
              <Stepper
                current={belowStep}
                steps={SHORT_STEPS}
                labelPlacement="below"
                onStepClick={setBelowStep}
              />
              <p className="text-sm text-muted-foreground">
                Step {belowStep + 1} of {SHORT_STEPS.length}. Every title is centred on its marker because none
                has a description.
              </p>
            </div>
          }
          code={`<Stepper
  current={step}
  steps={[
    { label: 'Account' },
    { label: 'Studio' },
    { label: 'Invite team' },
    { label: 'Review' },
  ]}
  labelPlacement="below"
  onStepClick={setStep}
/>`}
        />

        <DemoCard
          title="Vertical timeline"
          preview={
            <div className="w-full max-w-md">
              <Stepper
                current={verticalStep}
                orientation="vertical"
                steps={TIMELINE_STEPS}
                onStepClick={setVerticalStep}
              />
            </div>
          }
          code={`<Stepper
  current={step}
  orientation="vertical"
  steps={[
    { label: 'Submitted', description: 'Mar 2 · Application received' },
    { label: 'Under review', description: 'Mar 4 · Panel scoring' },
    { label: 'Decision', description: 'Mar 9 · Offer sent' },
    { label: 'Onboarding' },
  ]}
  onStepClick={setStep}
/>`}
          usage={`// The last step has no description, so its title is vertically centred
// against the marker (alignTitles="center", the default). Pass
// alignTitles="start" to top-align every title instead.`}
        />

        <DemoCard
          title="Compact dots"
          preview={
            <div className="w-full space-y-4">
              <Stepper
                current={verticalStep}
                variant="dots"
                size="sm"
                steps={SHORT_STEPS}
                onStepClick={setVerticalStep}
              />
              <Stepper
                current={verticalStep}
                variant="dots"
                size="sm"
                orientation="vertical"
                steps={SHORT_STEPS}
                onStepClick={setVerticalStep}
                className="max-w-xs"
              />
            </div>
          }
          code={`<Stepper
  current={step}
  variant="dots"
  size="sm"
  steps={[{ label: 'Plan' }, { label: 'Build' }, { label: 'Ship' }]}
  onStepClick={setStep}
/>

<Stepper current={step} variant="dots" orientation="vertical" steps={steps} />`}
          usage={`// Dots drop the numbers but keep the same ordered-list semantics and
// screen-reader state text. Use them in toolbars, drawers and narrow sidebars.`}
        />
      </div>
    </ComponentPage>
  );
}
