import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Textarea } from '@slipstream-ui/core';

export default function TextareaPage() {
  return (
    <ComponentPage
      id="textarea"
      title="Textarea"
      description="Multi-line text input styled to match Input."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: 'string', description: 'Controlled value; omit for uncontrolled usage.' },
        { name: 'placeholder', type: 'string', description: 'Placeholder text shown when empty.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the textarea.' },
      ]}
      accessibility={[
        'Native textarea semantics: multiline text entry and form validation work natively.',
        'Provide an accessible name via Label or aria-label.',
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            <Textarea placeholder="Tell us about your project" className="max-w-md" />
          </div>
        }
        code="// See the examples in the props table above"
      />
    </ComponentPage>
  );
}
