---
'@slipstream-ui/core': patch
---

Unify router-link props: every component that renders a destination now accepts `linkComponent` + `linkHrefProp` via the shared `LinkLikeProps` type. `linkHrefProp` was added to ArticleCard, DealCard, TombstoneCard, ContactStrip, AnnouncementBar, FeatureGrid, Sidebar (AppShell) and EntityCard.
