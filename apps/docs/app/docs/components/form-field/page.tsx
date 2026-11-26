import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/form-field', {
  title: 'FormField',
  description:
    'Label + control + hint/error in one unit with htmlFor, aria-describedby, and aria-invalid wiring applied automatically.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('form-field')}
      id="form-field"
      title="FormField"
      description="Label + control + hint/error in one unit with htmlFor, aria-describedby, and aria-invalid wiring applied automatically."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'id', type: 'string', defaultValue: 'required', description: "The control's id: shared with the label's htmlFor and hint/error ids." },
        { name: 'label', type: 'string', defaultValue: 'required', description: 'Visible label text (kept for screen readers when labelHidden).' },
        { name: 'hint', type: 'string', description: 'Helper text under the control, wired via aria-describedby.' },
        { name: 'error', type: 'string', description: 'Validation error; replaces the hint, sets aria-invalid, announced via role=alert.' },
        { name: 'required', type: 'boolean', defaultValue: 'false', description: 'Renders the required marker next to the label.' },
        { name: 'labelHidden', type: 'boolean', defaultValue: 'false', description: 'Keeps the label sr-only while hiding it visually.' },
        { name: 'labelPlacement', type: "'top' | 'left'", defaultValue: "'top'", description: 'Stack the label above the control or inline it to the left (fixed label column).' },
        { name: 'tooltip', type: 'string', description: 'Info icon rendered after the label; opens a tooltip with this text.' },
        { name: 'trailing', type: 'ReactNode', description: "Slot pinned to the far right of the label row (badge, link, action)." },
        { name: 'children', type: 'ReactNode', description: 'Exactly one control element: id/aria wiring is cloned onto it.' },
      ]}
      accessibility={[
        'Label pairs via htmlFor/id automatically.',
        'aria-describedby points at the hint: or the error when one is present.',
        'Errors render with role=alert and flip aria-invalid on the control.',
        'The required asterisk is aria-hidden; native required comes from the control itself.',
      ]}
      browserNotes={[
        'id/aria cloning and role=alert are plain DOM: works in every supported browser.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
