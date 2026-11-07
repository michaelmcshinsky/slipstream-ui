'use client';

import { useState } from 'react';
import { RangeSlider } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function RangeSliderPage() {
  const [revenue, setRevenue] = useState<[number, number]>([5, 100]);

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
      ]}
    >
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
    </ComponentPage>
  );
}
