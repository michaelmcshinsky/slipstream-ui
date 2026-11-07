---
"@slipstream-ui/core": minor
"@slipstream-ui/cli": patch
"@slipstream-ui/themes": minor
---

Add `linkHrefProp` so router-bound components work with react-router's `to`
prop, `brandLabel` and `mobileActions` on SiteHeader, and `activeHref` /
`match` on SiteFooter. Fix the mobile menu button icon and expanded state,
wire the CLI to prebuilt and Tailwind 4 stylesheets (including `src/styles.css`
targets), and correct the install docs.
