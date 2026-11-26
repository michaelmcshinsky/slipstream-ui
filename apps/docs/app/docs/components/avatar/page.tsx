import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/avatar', {
  title: "Avatar",
  description: "A user profile image component with fallback support and accessible image loading.",
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('avatar')}
      id="avatar"
      title="Avatar"
      description="A user profile image component with fallback support and accessible image loading. Compose Avatar + AvatarImage + AvatarFallback."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'Avatar.className', type: 'string', description: 'Circular container (h-10 w-10, rounded-full); scale with h-*/w-* classes.' },
        { name: 'AvatarImage.src / alt', type: 'string', defaultValue: 'required', description: 'Image source and required alt text; renders only after load.' },
        { name: 'AvatarFallback.children / className', type: 'ReactNode / string', description: 'Initials or icon shown while loading and after failure.' },
        { name: 'AvatarFallback.delayMs', type: 'number', description: 'Delay before the fallback appears (avoids flash on fast loads).' },
      ]}
      accessibility={[
        'AvatarImage requires alt text for accessibility',
        'AvatarFallback content is announced when image fails',
        'Radix Avatar handles image loading errors automatically',
        'Use meaningful alt text describing the person',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
