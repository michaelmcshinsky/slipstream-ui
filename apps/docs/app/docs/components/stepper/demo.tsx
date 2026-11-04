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

export default function StepperPage() {
  const [step, setStep] = useState(1);

  return (
    <ComponentPage
      id="stepper"
      title="Stepper"
      description="Multi-step flow indicator: ordered list, aria-current step, text state for complete/current/upcoming."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'steps', type: '{ label: string; description?: string }[]', defaultValue: 'required', description: 'Ordered step definitions.' },
        { name: 'current', type: 'number', defaultValue: 'required', description: 'Zero-based index of the active step.' },
        { name: 'orientation', type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", description: 'Layout direction.' },
        { name: 'onStepClick', type: '(index: number) => void', description: 'Makes steps clickable (revisit flows).' },
      ]}
      accessibility={['Ordered list semantics; the active step carries aria-current="step".', 'Complete/current/upcoming are stated in screen-reader text, not only color.']}
    >
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
  onStepClick?: (index: number) => void;
};`}
      />
    </ComponentPage>
  );
}
