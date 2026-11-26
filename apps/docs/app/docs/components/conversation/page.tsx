import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/conversation', {
  title: "Conversation",
  description: "A container for displaying a list of chat messages with auto-scroll and loading states.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('conversation')}
      id="conversation"
      title="Conversation"
      description="A container for displaying a list of chat messages with auto-scroll, streaming cursors, welcome state and history pagination."
      npmPackages="@slipstream-ui/ai"
      propsRows={[
        { name: 'messages', type: 'Message[]', defaultValue: 'required', description: 'Array of message objects to display' },
        { name: 'isLoading', type: 'boolean', defaultValue: 'false', description: 'Whether assistant is generating a response' },
        { name: 'showAvatars', type: 'boolean', defaultValue: 'true', description: 'Whether to show avatars for messages' },
        { name: 'loadingMessage', type: 'string', defaultValue: "'Thinking...'", description: 'Text to display while loading' },
        { name: 'renderContent', type: '(content: string) => ReactNode', defaultValue: 'undefined', description: 'Custom renderer applied to every message (e.g. markdown)' },
        { name: 'density', type: "'comfortable' | 'compact' | 'tight'", defaultValue: "'comfortable'", description: 'Transcript padding/gap, forwarded to every bubble' },
        { name: 'messageSurface', type: "'auto' | 'none' | 'card' | 'muted' | 'primary'", defaultValue: "'auto'", description: 'Bubble surface forwarded to every message; none gives a borderless transcript' },
        { name: 'streamingMessageId', type: 'string', defaultValue: 'undefined', description: 'ID of the message still generating; shows its cursor and auto-scrolls' },
        { name: 'userAvatarSrc / userAvatarFallback', type: 'string', description: 'User avatar image and fallback initials.' },
        { name: 'assistantAvatarSrc / assistantAvatarFallback', type: 'string', description: 'Assistant avatar image and fallback initials.' },
        { name: 'showScrollButton', type: 'boolean', defaultValue: 'true', description: 'Floating "scroll to latest" pill when scrolled up.' },
        { name: 'showDownload', type: 'boolean', defaultValue: 'false', description: 'Download button exporting the transcript as Markdown.' },
        { name: 'messageErrors', type: 'Record<string, string>', description: 'Per-message generation failures; renders retry cards.' },
        { name: 'onRetryMessage', type: '(message: Message) => void', description: 'Retry handler for messages in messageErrors.' },
        { name: 'welcomeTitle / welcomeDescription', type: 'string', description: 'Empty-transcript heading and supporting copy.' },
        { name: 'welcomeSuggestions / onWelcomeSelect', type: 'string[] / (prompt: string) => void', description: 'Starter prompts rendered as buttons under the welcome copy.' },
        { name: 'userLabel / assistantLabel', type: 'string', description: 'Display names per role; override for localization.' },
        { name: 'labels', type: '{ transcript?, responseComplete?, loadEarlier?, loadingEarlier?, latest?, download? }', description: 'Localized chrome copy: landmark, announcements and history controls.' },
        { name: 'hasMoreHistory / isLoadingMore / onLoadMore', type: 'boolean / boolean / () => void', description: 'History pagination: renders a "load earlier" control at the top.' },
      ]}
      accessibility={[
        "Auto-scroll behavior is smooth and doesn't interrupt users",
        'Loading state is visually indicated',
        'Consider adding aria-live regions for streaming responses',
        'Ensure users can navigate through messages with keyboard if needed',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
