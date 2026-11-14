---
"@slipstream-ui/core": patch
"@slipstream-ui/ai": patch
"@slipstream-ui/themes": patch
---

fix(a11y): add a success ink token for text on success tints

`text-success` on `bg-success/10` measured 4.11:1 in light mode, under the
4.5:1 minimum for small text. `success-ink` joins `warning-ink` and `info-ink`:
5.6:1 on a 10% tint in light mode and 7.9:1 on the dark card.

The ToolCall `completed` chip, the Confirmation `approved` chip and the Alert
`success` variant now use `text-success-ink`. A themes test pins both values and
fails if the plain `success` token ever starts passing on a tint (which would
mean the token contract changed).
