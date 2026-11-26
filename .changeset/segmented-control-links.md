---
'@slipstream-ui/core': patch
---

SegmentedControl link mode: options accept `href` to render real links for URL-backed view switches (refresh-safe, no-JS, cacheable). Active segment becomes a non-link `aria-current="page"` marker; `linkComponent`/`linkHrefProp` support client-side routers. Button mode is unchanged.
