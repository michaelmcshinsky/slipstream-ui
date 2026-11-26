'use client';

import { FormField, PasswordInput } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
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
    </>
  );
}
