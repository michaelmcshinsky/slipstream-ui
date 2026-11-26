---
"@slipstream-ui/core": patch
---

`PageHeader` `description`/`subtitle` and `SectionHeading` `description` now accept `ReactNode` instead of only `string`, so ledes can contain links and inline markup without consumers re-implementing the heading block (consumer feedback: utah-dance).
