import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/suggestions', {
  title: "Suggestions",
  description: "Offer useful next prompts after an AI response.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('suggestions')}
      id="suggestions"
      title="Suggestions"
      description="Offer useful next prompts after an AI response."
      npmPackages="@slipstream-ui/ai"
      propsRows={[
        { name: 'suggestions', type: 'Suggestion[]', description: 'Required list of { id, text, type? }; type is action | query | follow-up.' },
        { name: 'onSelect', type: '(suggestion: Suggestion) => void', description: 'Called with the chosen suggestion.' },
        { name: 'maxDisplay', type: 'number', defaultValue: '4', description: 'Maximum suggestions rendered; 0 or undefined shows all.' },
        { name: 'className', type: 'string', description: 'Additional classes for the suggestions container.' },
      ]}
      accessibility={[
        'Suggestions render as buttons in source order.',
        'Keep suggestion text short and action-oriented for screen-reader users.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
