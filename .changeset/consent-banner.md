---
'@slipstream-ui/core': minor
---

New ConsentBanner component plus a headless `useConsent` hook: per-purpose consent preferences persisted in localStorage with expiry, cross-instance and cross-tab sync. Render `<ConsentBanner onAccept onDecline onManage>` while `!consent.decided` to replace hand-rolled cookie banners.
