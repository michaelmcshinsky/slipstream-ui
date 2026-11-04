'use client';

import { FormField, PasswordInput } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function PasswordInputPage() {
  return (
    <ComponentPage
      id="password-input"
      title="PasswordInput"
      description="Password field with an accessible show/hide toggle (aria-pressed), built on Input."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'showLabel', type: 'string', defaultValue: "'Show password'", description: 'Accessible label while hidden.' },
        { name: 'hideLabel', type: 'string', defaultValue: "'Hide password'", description: 'Accessible label while visible.' },
        { name: '…InputProps', type: 'InputProps', description: 'All Input props pass through (value, onChange, autoComplete…).' },
      ]}
      accessibility={['The toggle is a real button with aria-pressed and Show/Hide labels.', 'Revealing never moves focus away from the field.']}
    >
      <DemoCard
        title="Sign-in field"
        preview={
          <div className="w-full max-w-sm">
            <FormField id="pi-demo" label="Password" hint="At least 12 characters">
              <PasswordInput autoComplete="current-password" defaultValue="correct-horse-battery" />
            </FormField>
          </div>
        }
        code={`<FormField id="password" label="Password" hint="At least 12 characters">
  <PasswordInput autoComplete="current-password" />
</FormField>`}
        usage={`// Always starts masked; reveal is user-initiated. Keep autoComplete correct
// (current-password / new-password) so password managers still work.`}
        types={`type PasswordInputProps = Omit<InputProps, 'type'> & {
  showLabel?: string;
  hideLabel?: string;
};`}
      />
    </ComponentPage>
  );
}
