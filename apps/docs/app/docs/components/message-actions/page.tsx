import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/message-actions', {
  title: "MessageActions",
  description: "Feedback toolbar for AI responses: copy, thumbs up/down rating, and regenerate. Every action is a callback: the component holds no conversation state.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('message-actions')}
      id="message-actions"
      title="MessageActions"
      description="Feedback toolbar for AI responses: copy, thumbs up/down rating, and regenerate. Every action is a callback: the component holds no conversation state."
      npmPackages="@slipstream-ui/ai"
      propsRows={[
        { name: 'content', type: 'string', description: 'Text copied by the copy action; omit to hide copy.' },
        { name: 'onCopy', type: '(content: string) => void', description: 'Called after the user copies the message.' },
        { name: 'onFeedback', type: "(rating: FeedbackRating | undefined) => void", description: 'Rating callback; selecting the same rating clears it.' },
        { name: 'onRegenerate', type: '() => void', description: 'Regenerate callback; omit to hide the action.' },
        { name: 'autohide', type: "'always' | 'on-hover' | 'not-last'", defaultValue: "'always'", description: 'Visibility rule; hover modes reveal on parent hover/focus.' },
        { name: 'labels', type: 'object', description: 'Localizable copy/copied/thumbUp/thumbDown/regenerate labels.' },
        { name: 'className', type: 'string', description: 'Additional classes for the toolbar root.' },
      ]}
      accessibility={[
        'Root has role=toolbar with an accessible name.',
        'Rating buttons expose aria-pressed selection state.',
        'All labels are localizable via the labels prop.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
