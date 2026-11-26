'use client';

import { useState } from 'react';
import { RangeSlider } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  const [revenue, setRevenue] = useState<[number, number]>([5, 100]);
  const [budget, setBudget] = useState<[number, number]>([30, 70]);

  return (
    <>
      <div className="space-y-8">
        <DemoCard
          title="Amount range filter"
          preview={
            <div className="w-full max-w-md">
              <p className="mb-3 text-sm font-medium">Amount range</p>
              <RangeSlider
                min={5}
                max={100}
                step={5}
                value={revenue}
                onValueChange={setRevenue}
                startLabel="Amount minimum"
                endLabel="Amount maximum"
                formatValue={(value) => `$${value}M`}
              />
              <p className="mt-3 text-sm text-muted-foreground">
                Showing results from ${revenue[0]}M to ${revenue[1]}M.
              </p>
            </div>
          }
          code={`<RangeSlider
  min={5}
  max={100}
  step={5}
  value={revenue}
  onValueChange={setRevenue}
  startLabel="Amount minimum"
  endLabel="Amount maximum"
  formatValue={(value) => \`$\${value}M\`}
/>`}
          usage={`// value is [low, high], not a single number.
// Use formatValue for currency, percent or compact units.
// Pair with FilterChips to show the active range outside the panel.`}
          types={`type RangeSliderProps = {
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  min?: number;
  max?: number;
  step?: number;
  startLabel?: string;
  endLabel?: string;
  formatValue?: (value: number) => string;
  showValues?: boolean;
  disabled?: boolean;
};`}
        />

        <DemoCard
          title="Percentage split and disabled state"
          preview={
            <div className="grid w-full gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-3 text-sm font-medium">Budget allocation</p>
                <RangeSlider
                  min={0}
                  max={100}
                  step={5}
                  value={budget}
                  onValueChange={setBudget}
                  startLabel="Budget floor"
                  endLabel="Budget ceiling"
                  formatValue={(value) => `${value}%`}
                />
                <p className="mt-3 text-sm text-muted-foreground">
                  Allocating {budget[0]}% to {budget[1]}% of the budget.
                </p>
              </div>
              <div>
                <p className="mb-3 text-sm font-medium">Locked range</p>
                <RangeSlider
                  defaultValue={[20, 60]}
                  startLabel="Locked minimum"
                  endLabel="Locked maximum"
                  formatValue={(value) => `${value}%`}
                  disabled
                />
                <p className="mt-3 text-sm text-muted-foreground">Disabled while an approval is pending.</p>
              </div>
            </div>
          }
          code={`<RangeSlider
  min={0}
  max={100}
  step={5}
  value={budget}
  onValueChange={setBudget}
  formatValue={(value) => \`\${value}%\`}
/>

<RangeSlider defaultValue={[20, 60]} disabled />`}
        />
      </div>
    </>
  );
}
