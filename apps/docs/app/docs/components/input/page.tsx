import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/input', {
  title: "Input",
  description: "A text input field with support for various input types and standard HTML input attributes.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('input')}
      id="input"
      title="Input"
      description="A text input field with support for various input types and standard HTML input attributes."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'type', type: 'HTML input type', defaultValue: "'text'", description: 'Any native input type: text, email, password, number, tel, url, search, date, time, file…' },
        { name: 'placeholder', type: 'string', defaultValue: 'undefined', description: 'Placeholder text (never a label substitute).' },
        { name: 'disabled', type: 'boolean', defaultValue: 'false', description: 'Disables the input.' },
        { name: 'readOnly', type: 'boolean', defaultValue: 'false', description: 'Renders the value read-only (still focusable).' },
        { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Marks the input as required for form validation.' },
        { name: 'aria-invalid', type: 'boolean', defaultValue: 'false', description: 'Announces validation failure; pair with aria-describedby error text.' },
        { name: 'autoComplete', type: 'string', defaultValue: 'undefined', description: 'HTML autofill hint (e.g. "email", "new-password", "one-time-code").' },
      ]}
      browserNotes={['Every native InputHTMLAttributes member (min, max, step, pattern, inputMode…) passes through to the underlying <input>.']}
      accessibility={[
        'Full keyboard navigation support',
        'Screen reader announces input type and placeholder',
        'Disabled state is properly announced',
        'Visible focus indicator for keyboard users',
        'Supports HTML5 validation attributes (required, pattern, minLength…)',
        'Pair every input with a <Label>; use aria-describedby for hints and errors',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
