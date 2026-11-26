import { ComponentPage, type ComponentPageProps } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { FormField, Textarea } from '@slipstream-ui/core';

export default function TextareaPage({ manifest }: { manifest?: ComponentPageProps['manifest'] }) {
  return (
    <ComponentPage
        manifest={manifest}
      id="textarea"
      title="Textarea"
      description="Multi-line text input styled to match Input."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: 'string', description: 'Controlled value; omit for uncontrolled usage.' },
        { name: 'defaultValue', type: 'string', description: 'Initial value for uncontrolled usage.' },
        { name: 'placeholder', type: 'string', description: 'Placeholder text shown when empty.' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the textarea.' },
        { name: 'onChange', type: 'React.ChangeEventHandler<HTMLTextAreaElement>', description: 'Native change handler for controlled or uncontrolled updates.' },
      ]}
      accessibility={[
        'Native textarea semantics: multiline text entry and form validation work natively.',
        'Provide an accessible name via Label or aria-label.',
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="w-full max-w-md space-y-5">
            <FormField id="ta-about" label="About the project" hint="A few sentences is plenty.">
              <Textarea placeholder="Tell us about your project" rows={5} />
            </FormField>
            <FormField id="ta-feedback" label="Feedback" error="Please describe the issue in at least 10 characters.">
              <Textarea defaultValue="It broke." rows={3} aria-invalid="true" />
            </FormField>
            <FormField id="ta-disabled" label="Archived notes">
              <Textarea disabled defaultValue="Read-only history" rows={2} />
            </FormField>
          </div>
        }
        code={`import { FormField, Textarea } from '@slipstream-ui/core';

<FormField id="about" label="About the project" hint="A few sentences is plenty.">
  <Textarea placeholder="Tell us about your project" rows={5} />
</FormField>

<FormField id="feedback" label="Feedback" error="Describe the issue.">
  <Textarea aria-invalid />
</FormField>`}
        usage={"import { Textarea } from '@slipstream-ui/core';\n\n// Basic usage\n<Textarea />"}
        types={"type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;}"}
      />
    </ComponentPage>
  );
}
