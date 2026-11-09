'use client';

import { useState } from 'react';
import { RangeSlider } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function RangeSliderPage() {
  const [revenue, setRevenue] = useState<[number, number]>([5, 100]);
  const [budget, setBudget] = useState<[number, number]>([30, 70]);

  return (
    <ComponentPage
      id="range-slider"
      title="RangeSlider"
      description="Dual-thumb numeric range slider with labeled native inputs and formatted values."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: '[number, number]', description: 'Controlled low/high pair.' },
        { name: 'defaultValue', type: '[number, number]', description: 'Initial low/high pair when uncontrolled. Defaults to [min, max].' },
        { name: 'onValueChange', type: '(value: [number, number]) => void', description: 'Fires with the next low/high pair.' },
        { name: 'min', type: 'number', defaultValue: '0', description: 'Lower bound.' },
        { name: 'max', type: 'number', defaultValue: '100', description: 'Upper bound.' },
        { name: 'step', type: 'number', defaultValue: '1', description: 'Increment.' },
        { name: 'startLabel', type: 'string', defaultValue: "'Minimum'", description: 'Accessible label for the low thumb.' },
        { name: 'endLabel', type: 'string', defaultValue: "'Maximum'", description: 'Accessible label for the high thumb.' },
        { name: 'formatValue', type: '(value: number) => string', description: 'Formats the displayed values and aria-valuetext.' },
        { name: 'showValues', type: 'boolean', defaultValue: 'true', description: 'Show the current low/high values above the track.' },
        { name: 'disabled', type: 'boolean', description: 'Disable both thumbs.' },
      ]}
      accessibility={[
        'Uses two native range inputs, each with its own label and aria-valuetext.',
        'The low thumb cannot cross the high thumb, so the pair always stays ordered.',
        'Both thumbs are centred on the track in WebKit and Firefox, so the grab target matches the visual line.',
      ]}
      browserNotes={[
        'The track is 4px tall and the thumb is 16px. WebKit positions the thumb from the track top, so the component applies a -6px offset to centre it; Firefox centres it natively.',
      ]}
    >
      <div className="space-y-8">
        <DemoCard
          title="Revenue range filter"
          preview={
            <div className="w-full max-w-md">
              <p className="mb-3 text-sm font-medium">Revenue range</p>
              <RangeSlider
                min={5}
                max={100}
                step={5}
                value={revenue}
                onValueChange={setRevenue}
                startLabel="Revenue minimum"
                endLabel="Revenue maximum"
                formatValue={(value) => `$${value}M`}
              />
              <p className="mt-3 text-sm text-muted-foreground">
                Showing deals from ${revenue[0]}M to ${revenue[1]}M revenue.
              </p>
            </div>
          }
          code={`<RangeSlider
  min={5}
  max={100}
  step={5}
  value={revenue}
  onValueChange={setRevenue}
  startLabel="Revenue minimum"
  endLabel="Revenue maximum"
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
    </ComponentPage>
  );
}
