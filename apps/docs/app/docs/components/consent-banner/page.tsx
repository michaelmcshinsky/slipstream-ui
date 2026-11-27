import type { Metadata } from 'next';
import Demo from './demo';
import { ComponentPage } from '@/components/component-page';
import { getRegistryManifest } from '@/lib/registry-manifests.generated';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/consent-banner', {
  title: 'ConsentBanner',
  description:
    'Styled cookie/consent banner with accept, decline and manage actions — pair with the headless useConsent hook for persisted per-purpose consent.',
});

export default function Page() {
  return (
    <ComponentPage
      manifest={getRegistryManifest('consent-banner')}
      id="consent-banner"
      title="ConsentBanner"
      description="Styled cookie/consent banner: fixed bottom bar with accept, decline and an optional manage-preferences action. Presentational only — wire it to useConsent (or your own store) and render it while the visitor is undecided."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'onAccept', type: '() => void', defaultValue: 'required', description: 'Called on accept; typically consent.setAll(true).' },
        { name: 'onDecline', type: '() => void', defaultValue: 'required', description: 'Called on decline; typically consent.setAll(false).' },
        { name: 'onManage', type: '() => void', description: 'Optional manage-preferences action for granular consent dialogs.' },
        { name: 'title', type: 'ReactNode', description: 'Banner heading; omit for a single-line notice.' },
        { name: 'children', type: 'ReactNode', description: 'Body copy; put privacy-policy links here.' },
        { name: 'label', type: 'string', defaultValue: "'Cookie consent'", description: 'Accessible name for the banner region.' },
        { name: 'acceptLabel', type: 'ReactNode', defaultValue: "'Accept'", description: 'Accept button label.' },
        { name: 'declineLabel', type: 'ReactNode', defaultValue: "'Decline'", description: 'Decline button label.' },
        { name: 'manageLabel', type: 'ReactNode', defaultValue: "'Manage'", description: 'Manage-preferences button label.' },
      ]}
      accessibility={[
        'Renders role=region with an aria-label (default "Cookie consent"); localize label and button labels.',
        'Accept and decline are equally prominent native Buttons with visible focus rings — no dark patterns.',
        'Bottom padding includes env(safe-area-inset-bottom) for notched devices.',
      ]}
    >
      <Demo />
    </ComponentPage>
  );
}
