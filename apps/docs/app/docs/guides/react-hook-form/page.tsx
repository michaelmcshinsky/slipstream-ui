import type { Metadata } from 'next';
import { CodeBlock } from '@slipstream-ui/ai';

export const metadata: Metadata = {
  title: 'React Hook Form',
  description:
    'Use Slipstream controls with react-hook-form 7.x: register() for native inputs, Controller for value-based callbacks, and FormField for error and aria wiring.',
};

export default function ReactHookFormGuidePage() {
  return (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">
        React Hook Form
      </h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-muted-foreground">
        Slipstream controls work with <code className="text-foreground">react-hook-form</code> 7.x
        (tested with 7.90). The short version: <code className="text-foreground">register()</code>{' '}
        for native inputs, <code className="text-foreground">Controller</code> when you want the
        transformed value. <code className="text-foreground">FormField</code> owns the label,
        hint, error and <code className="text-foreground">aria-invalid</code> wiring either way.
      </p>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        Which pattern to use
      </h2>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="py-2 pr-4 font-medium">Control</th>
              <th className="py-2 pr-4 font-medium">Pattern</th>
              <th className="py-2 font-medium">Why</th>
            </tr>
          </thead>
          <tbody className="align-top">
            <tr className="border-b border-border/60">
              <td className="py-2 pr-4"><code>Input</code>, <code>Textarea</code></td>
              <td className="py-2 pr-4"><code>register()</code></td>
              <td className="py-2 text-muted-foreground">Native input, ref forwarded.</td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-4"><code>Select</code>, <code>Checkbox</code></td>
              <td className="py-2 pr-4"><code>register()</code> or <code>Controller</code></td>
              <td className="py-2 text-muted-foreground">
                Both forward the native change event. Use <code>Controller</code> for the value
                callback.
              </td>
            </tr>
            <tr className="border-b border-border/60">
              <td className="py-2 pr-4"><code>DatePicker</code>, <code>TimePicker</code></td>
              <td className="py-2 pr-4"><code>Controller</code></td>
              <td className="py-2 text-muted-foreground">
                The ISO string contract is clearer than reading the DOM value.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        register() with FormField
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        <code className="text-foreground">FormField</code> clones its child and sets{' '}
        <code className="text-foreground">id</code>,{' '}
        <code className="text-foreground">aria-describedby</code> and{' '}
        <code className="text-foreground">aria-invalid</code>. Pass the field id and the resolved
        error message; <code className="text-foreground">register()</code> supplies the name, ref
        and native handler.
      </p>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
  defaultValues: { email: '', notes: '' },
});

<FormField id="email" label="Email" required error={errors.email?.message}>
  <Input id="email" type="email" autoComplete="email" {...register('email')} />
</FormField>

<FormField id="notes" label="Notes" hint="Optional" error={errors.notes?.message}>
  <Textarea id="notes" rows={4} {...register('notes')} />
</FormField>`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        Controller for value-based controls
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        <code className="text-foreground">Select</code> exposes both the native{' '}
        <code className="text-foreground">onChange</code> event and{' '}
        <code className="text-foreground">onValueChange(value)</code>. Use one, not both. With{' '}
        <code className="text-foreground">Controller</code>, bind{' '}
        <code className="text-foreground">field.value</code> and{' '}
        <code className="text-foreground">field.onChange</code> to the value callback.
      </p>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`<Controller
  control={control}
  name="game"
  rules={{ required: 'Pick a game' }}
  render={({ field, fieldState }) => (
    <FormField id="game" label="Game" required error={fieldState.error?.message}>
      <Select
        id="game"
        options={games}
        value={field.value}
        onValueChange={field.onChange}
        onBlur={field.onBlur}
        placeholder="Choose a game"
      />
    </FormField>
  )}
/>

<Controller
  control={control}
  name="startsAt"
  render={({ field, fieldState }) => (
    <FormField id="startsAt" label="Starts" required error={fieldState.error?.message}>
      <DatePicker
        id="startsAt"
        value={field.value}
        onValueChange={field.onChange}
        onBlur={field.onBlur}
        clearable
      />
    </FormField>
  )}
/>

<Controller
  control={control}
  name="terms"
  rules={{ required: 'Accept the terms' }}
  render={({ field, fieldState }) => (
    <div>
      <Checkbox
        id="terms"
        label="I accept the terms"
        checked={field.value}
        onCheckedChange={field.onChange}
        onBlur={field.onBlur}
      />
      {fieldState.error?.message ? (
        <p role="alert" className="mt-1 text-xs text-destructive">
          {fieldState.error.message}
        </p>
      ) : null}
    </div>
  )}
/>`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        Adapter example
      </h2>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        If you use the same controls everywhere, a small typed adapter keeps the forms honest
        without a dependency on react-hook-form inside the library.
      </p>
      <div className="mt-4">
        <CodeBlock
          language="tsx"
          code={`import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { FormField, Select } from '@slipstream-ui/core';

type SelectFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: { value: string; label: string }[];
  hint?: string;
};

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  options,
  hint,
}: SelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormField id={name} label={label} hint={hint} error={fieldState.error?.message}>
          <Select
            id={name}
            options={options}
            value={field.value}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
          />
        </FormField>
      )}
    />
  );
}`}
        />
      </div>

      <h2 className="mt-12 scroll-m-20 text-2xl font-semibold tracking-tight">
        Notes
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <code className="text-foreground">Select</code> is built on the native{' '}
          <code>&lt;select&gt;</code>. Its <code>onChange</code> forwards the React change event,
          so <code>register()</code> works; <code>onValueChange</code> is the value convenience.
        </li>
        <li>
          <code className="text-foreground">Checkbox</code> forwards the native change event and
          also provides <code>onCheckedChange(checked)</code>.
        </li>
        <li>
          <code className="text-foreground">DatePicker</code> and{' '}
          <code className="text-foreground">TimePicker</code> use ISO strings and{' '}
          <code className="text-foreground">HH:MM</code>; prefer{' '}
          <code>onValueChange</code> over reading the DOM.
        </li>
        <li>
          Pass <code>defaultValues</code> to <code>useForm</code> so controlled selects and
          checkboxes start defined. An undefined value can flip a checkbox from uncontrolled to
          controlled.
        </li>
        <li>
          When consuming Slipstream from a linked local checkout during co-development, dedupe{' '}
          <code>react</code>, <code>react-dom</code>, and <code>react/jsx-runtime</code> in the
          consumer&apos;s bundler. A second React copy breaks Radix <code>Slot</code> (used by{' '}
          <code>asChild</code>) because React 19 elements are not recognised by React 18. Published
          packages dedupe through peer dependencies, so the override is only needed while the
          packages are linked.
        </li>
        <li>
          <code className="text-foreground">FormField</code> is a client component; forms using it
          are client components too. Server actions can still receive the submitted values.
        </li>
      </ul>
    </div>
  );
}
