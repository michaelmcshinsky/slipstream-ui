import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/tool-call', {
  title: "ToolCall",
  description: "A component for displaying AI tool/function calls with status, arguments, and results.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('tool-call')}
      id="tool-call"
      title="ToolCall"
      description="A component for displaying AI tool/function calls with status, arguments, and results."
      npmPackages="@slipstream-ui/ai"
      propsRows={[
        { name: 'toolCall', type: 'ToolCallData', defaultValue: 'required', description: 'Tool call object with name, arguments, status' },
        { name: 'showResult', type: 'boolean', defaultValue: 'true', description: 'Whether to display the result' },
        { name: 'labels', type: '{ pending?, running?, completed?, failed?, arguments?, result?, error? }', description: 'Localized status and section labels.' },
        { name: 'className', type: 'string', description: 'Extra classes for the root element.' },
      ]}
      accessibility={[
        'Status shown with both color and text label',
        'Arguments and results displayed in formatted code blocks',
        'Tool information organized in clear sections',
        'Status colors have sufficient contrast',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
