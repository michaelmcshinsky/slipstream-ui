import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/form', {
  title: 'Form',
  description:
    'Semantic form element with even-spacing layouts: stacked (default), bordered card, or inline row: native submit and validation untouched.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('form')}
      id="form"
      title="Form"
      description="Semantic form element with even-spacing layouts: stacked (default), bordered card, or inline row: native submit and validation untouched."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'variant', type: "'default' | 'card' | 'inline'", defaultValue: "'default'", description: 'Plain vertical stack, bordered card, or inline row with aligned ends.' },
        { name: 'gap', type: "'none' | 'sm' | 'md' | 'lg' | 'xl' | number", defaultValue: "'md'", description: 'Even spacing between children: token or exact pixels (16).' },
        { name: 'onSubmit', type: '(event) => void', description: 'Native submit handler: Enter in a text input submits like any form.' },
        { name: 'noValidate', type: 'boolean', defaultValue: 'false', description: 'Skip native validation when FormField drives errors.' },
      ]}
      accessibility={[
        'Renders a real <form>: Enter-to-submit, browser validation, and autocomplete work.',
        'Pair every control with FormField so names, hints, and errors are wired.',
        'With noValidate you own every message: never silently swallow an invalid state.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
