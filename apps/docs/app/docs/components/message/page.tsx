import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/message', {
  title: "Message",
  description: "A chat message component that displays messages from users, assistants, or system prompts with optional avatars.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('message')}
      id="message"
      title="Message"
      description="A chat message component that displays messages from users, assistants, or system prompts with optional avatars."
      propsRows={[
        { name: 'message', type: 'Message', defaultValue: 'required', description: 'The message object with role, content, and metadata' },
        { name: 'showAvatar', type: 'boolean', defaultValue: 'true', description: 'Whether to show the avatar' },
        { name: 'avatarSrc', type: 'string', defaultValue: 'undefined', description: 'Custom avatar image URL' },
        { name: 'avatarFallback', type: 'string', defaultValue: 'undefined', description: 'Fallback text for avatar' },
        { name: 'userLabel', type: 'string', defaultValue: "'You'", description: 'Display name for user messages (localization)' },
        { name: 'assistantLabel', type: 'string', defaultValue: "'Assistant'", description: 'Display name for assistant messages (localization)' },
        { name: 'density', type: "'comfortable' | 'compact' | 'tight'", defaultValue: "'comfortable'", description: 'Padding and gap scale for the bubble' },
        { name: 'surface', type: "'auto' | 'none' | 'card' | 'muted' | 'primary'", defaultValue: "'auto'", description: 'Bubble surface; auto keeps the role tint, none is transparent' },
        { name: 'renderContent', type: '(content: string) => ReactNode', defaultValue: 'undefined', description: 'Custom content renderer (e.g. markdown); replaces plain-text rendering' },
        { name: 'isStreaming', type: 'boolean', defaultValue: 'false', description: 'Shows a typing cursor and sets aria-busy while generating' },
        { name: 'error', type: 'string', description: 'Generation failure text; renders an error card in place of content.' },
        { name: 'onRetry', type: '() => void', description: 'Called when the user requests a retry after error; omit to hide the action.' },
        { name: 'onEditContent', type: '(content: string) => void', description: 'Edit-and-resubmit affordance for user messages.' },
        { name: 'labels', type: '{ retry?, edit?, save?, cancel? }', description: 'Localized action labels.' },
        { name: 'formatTime', type: '(date: Date) => string', description: 'Custom timestamp formatter.' },
        { name: 'locale', type: 'string', description: 'BCP-47 locale for the default timestamp formatter.' },
        { name: 'className', type: 'string', description: 'Extra classes for the root element.' },
      ]}
      accessibility={[
        'Message role and content are announced by screen readers',
        'Avatar has proper alt text from fallback or role',
        'System messages have distinct visual styling',
        'Timestamps are properly formatted for accessibility',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
