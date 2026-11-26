'use client';

import { useState } from 'react';
import { Button, ButtonGroup } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

type View = 'list' | 'board' | 'calendar';

export default function Demo() {
  const [view, setView] = useState<View>('list');
  const [step, setStep] = useState(2);

  return (
    <>
      <DemoCard
        title="View mode toggle (interactive)"
        preview={
          <div className="w-full space-y-4">
            <ButtonGroup aria-label="View mode">
              {(['list', 'board', 'calendar'] as const).map((mode) => (
                <Button
                  key={mode}
                  variant={view === mode ? 'default' : 'outline'}
                  onClick={() => setView(mode)}
                  aria-pressed={view === mode}
                >
                  {mode[0].toUpperCase() + mode.slice(1)}
                </Button>
              ))}
            </ButtonGroup>
            <p className="text-sm text-muted-foreground">
              view: <code className="text-foreground">{view}</code>: segments share one outline; the active
              segment carries the primary surface.
            </p>
          </div>
        }
        code={`const [view, setView] = useState('list');

<ButtonGroup aria-label="View mode">
  {modes.map((mode) => (
    <Button
      key={mode}
      variant={view === mode ? 'default' : 'outline'}
      onClick={() => setView(mode)}
      aria-pressed={view === mode}
    >
      {mode}
    </Button>
  ))}
</ButtonGroup>`}
        usage={`import { ButtonGroup, Button } from '@slipstream-ui/core';

// Border-bearing variants keep the joined outline intact.
<ButtonGroup aria-label="Zoom">
  <Button variant="outline">−</Button>
  <Button variant="outline">+</Button>
</ButtonGroup>`}
        types={`type ButtonGroupProps = {
  orientation?: 'horizontal' | 'vertical';
};`}
      />

      <DemoCard
        title="Vertical stepper (interactive)"
        preview={
          <div className="flex w-full items-start gap-6">
            <ButtonGroup orientation="vertical" aria-label="Step navigation">
              <Button variant="secondary" onClick={() => setStep((s) => Math.max(1, s - 1))}>
                Step back
              </Button>
              <Button variant="secondary" onClick={() => setStep((s) => s + 1)}>
                Step forward
              </Button>
            </ButtonGroup>
            <p className="text-sm text-muted-foreground">
              step <span className="font-medium text-foreground">{step}</span>: stacked segments share the
              horizontal edge.
            </p>
          </div>
        }
        code={`<ButtonGroup orientation="vertical" aria-label="Step navigation">
  <Button variant="secondary" onClick={back}>Step back</Button>
  <Button variant="secondary" onClick={forward}>Step forward</Button>
</ButtonGroup>`}
        usage={`// orientation="vertical" collapses vertical borders and rounds only
// the top/bottom outer corners.`}
      />
    </>
  );
}
