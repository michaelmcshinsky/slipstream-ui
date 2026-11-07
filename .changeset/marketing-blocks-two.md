---
"@slipstream-ui/core": minor
---

Add the second marketing block batch: `LogoCloud`, `FeatureGrid`, `FeatureRow`,
`Testimonial`, `ProcessSteps`, `ArticleCard`, `Newsletter`, `ContactStrip` and
`AnnouncementBar`. Each ships a manifest, tests, docs and registry payload.

`Newsletter` owns email capture state and success/error feedback but not the
CRM transport. `ArticleCard` accepts a router `linkComponent`. `AnnouncementBar`
owns dismissal only; persistence stays with the caller.
