# ConsentBanner

Styled cookie/consent banner: fixed bottom bar with accept, decline and an optional manage-preferences action. Pair it with the headless useConsent hook so the decision persists per-purpose in localStorage.

> Component ID: `consent-banner`
> Import: `import { ConsentBanner } from '@slipstream-ui/core'`
> Docs: https://slipstreamui.com/docs/components/consent-banner
> Registry: https://slipstreamui.com/registry/consent-banner.json
> Tier: molecule · Package: @slipstream-ui/core@0.12.1
> Manifest schema: v1 · manifest: v1

## Design intent

Every consumer app reinvents the same cookie banner and consent store. ConsentBanner owns the presentation (fixed bar, safe-area padding, labelled region, AA buttons); useConsent owns the headless state (per-purpose preferences, expiry, cross-tab sync) so neither side is coupled to the other.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| onAccept | `() => void` | — | yes | Called when the visitor accepts; typically consent.setAll(true). |
| onDecline | `() => void` | — | yes | Called when the visitor declines; typically consent.setAll(false). |
| onManage | `() => void` | — | no | Optional manage-preferences action for granular consent dialogs. |
| title | `ReactNode` | — | no | Banner heading; omit for a single-line notice. |
| children | `ReactNode` | — | no | Body copy; put privacy-policy links here. |
| label | `string` | `'Cookie consent'` | no | Accessible name for the banner region. |
| acceptLabel | `ReactNode` | `'Accept'` | no | Accept button label. |
| declineLabel | `ReactNode` | `'Decline'` | no | Decline button label. |
| manageLabel | `ReactNode` | `'Manage'` | no | Manage-preferences button label. |

## Examples

### Accept/decline with useConsent

The canonical wiring: render while undecided, persist through the hook.

```tsx
const consent = useConsent({ purposes: ['analytics'] });

{!consent.decided && (
  <ConsentBanner
    title="We use cookies"
    onAccept={() => consent.setAll(true)}
    onDecline={() => consent.setAll(false)}
    onManage={() => openPreferences()}
  >
    We use cookies for analytics.{' '}
    <a href="/privacy">Privacy policy</a>
  </ConsentBanner>
)}
```

### Gate analytics on a purpose

Read the same hook elsewhere to gate trackers; instances stay in sync.

```tsx
const consent = useConsent({ purposes: ['analytics'] });

useEffect(() => {
  if (consent.preferences?.analytics) loadAnalytics();
}, [consent.preferences]);
```

## Anti-patterns

- **Don't render before the decision is known** — Render the banner only while consent.decided is false, and read preferences (not decided) to gate trackers — a denied purpose and an undecided visitor are different states.
- **Don't block the page** — ConsentBanner is non-modal by design; a modal consent wall hurts conversion and accessibility. Use Dialog only if your policy genuinely requires it.

## Accessibility

- **Named region**: Renders role=region with aria-label (default 'Cookie consent')
- **Keyboard and focus**: All actions are native Buttons with visible focus rings; tab order is manage → decline → accept
- **Safe-area aware**: Bottom padding includes env(safe-area-inset-bottom) for notched devices

## Composition

- Compose with **useConsent** — Headless hook exported from @slipstream-ui/core; wire onAccept/onDecline/onManage to setAll/set/clear
  
  ```tsx
  const consent = useConsent({ purposes: ['analytics', 'marketing'] });
  ```
- Compose with **SiteFooter** — Re-open the banner or preferences dialog from a footer 'Cookie settings' link via consent.clear()
  
  ```tsx
  <SiteFooter contact={<button onClick={consent.clear}>Cookie settings</button>} />
  ```
- Related: Alert, Dialog, Button

