# Triage

Generated from the backlog. Status is mechanical: dependency and external blockers only.

| Order | ID | P | Hours | Status | Note |
|---|---|---|---|---|---|
| 1 | SLIP-001 | P0 | 4h | Ready |  |
| 2 | SLIP-002 | P0 | 6h | Blocked | Depends on SLIP-001 |
| 3 | SLIP-003 | P0 | 2h | Ready |  |
| 4 | SLIP-004 | P0 | 2h | Blocked | Depends on SLIP-030 |
| 5 | SLIP-010 | P0 | 6h | Blocked | Depends on SLIP-001 |
| 6 | SLIP-011 | P0 | 10h | Blocked | Depends on SLIP-010 |
| 7 | SLIP-012 | P0 | 8h | Blocked | Depends on SLIP-011 |
| 8 | SLIP-013 | P0 | 8h | Blocked | Depends on SLIP-012 |
| 9 | SLIP-014 | P0 | 8h | Blocked + external | Depends on SLIP-013; needs credentials/accounts |
| 10 | SLIP-015 | P0 | 6h | Blocked | Depends on SLIP-014 |
| 11 | SLIP-020 | P0 | 6h | Blocked + external | Depends on SLIP-010; needs credentials/accounts |
| 12 | SLIP-021 | P0 | 4h | Blocked + external | Depends on SLIP-010; needs credentials/accounts |
| 13 | SLIP-024 | P0 | 4h | Blocked | Depends on SLIP-015, SLIP-020, SLIP-021 |
| 14 | SLIP-030 | P0 | 4h | Ready |  |
| 15 | SLIP-031 | P0 | 10h | Blocked | Depends on SLIP-030 |
| 16 | SLIP-033 | P0 | 4h | Blocked | Depends on SLIP-031 |
| 17 | SLIP-040 | P0 | 3h | Blocked | Depends on SLIP-024 |
| 18 | SLIP-041 | P0 | 4h | Blocked | Depends on SLIP-040 |
| 19 | SLIP-042 | P0 | 12h | Blocked | Depends on SLIP-041 |
| 20 | SLIP-043 | P0 | 10h | Blocked | Depends on SLIP-042 |
| 21 | SLIP-045 | P0 | 8h | Blocked | Depends on SLIP-042 |
| 22 | SLIP-046 | P0 | 5h | Blocked | Depends on SLIP-043 |
| 23 | SLIP-047 | P0 | 5h | Blocked + external | Depends on SLIP-041; needs credentials/accounts |
| 24 | SLIP-048 | P0 | 4h | Blocked | Depends on SLIP-047 |
| 25 | SLIP-050 | P0 | 4h | Blocked + external | Depends on SLIP-024; needs credentials/accounts |
| 26 | SLIP-051 | P0 | 4h | Blocked | Depends on SLIP-002 |
| 27 | SLIP-016 | P1 | 6h | Blocked + external | Depends on SLIP-013; needs credentials/accounts |
| 28 | SLIP-022 | P1 | 4h | Blocked + external | Depends on SLIP-010; needs credentials/accounts |
| 29 | SLIP-023 | P1 | 6h | Blocked + external | Depends on SLIP-010; needs credentials/accounts |
| 30 | SLIP-032 | P1 | 8h | Blocked | Depends on SLIP-031 |
| 31 | SLIP-044 | P1 | 8h | Blocked | Depends on SLIP-042 |
| 32 | SLIP-052 | P1 | 6h | Blocked + external | Depends on SLIP-015; needs credentials/accounts |
| 33 | SLIP-053 | P1 | 4h | Blocked | Depends on SLIP-048 |

## Epic 7 - Axial adoption

| Order | ID | P | Hours | Status | Note |
|---|---|---|---|---|---|
| 34 | SLIP-070 | P0 | 18h | Done | 9 marketing blocks shipped; 100 components |
| 35 | SLIP-071 | P1 | 16h | Ready | Depends on SLIP-070 (done) |
| 36 | SLIP-072 | P1 | 18h | Ready | Depends on SLIP-070 (done) |
| 37 | SLIP-073 | P0 | 18h | Ready | Depends on SLIP-070 (done) |
| 38 | SLIP-074 | P0 | 28h | Ready | Depends on SLIP-070 (done); chart-library decision |
| 39 | SLIP-075 | P0 | 18h | Ready | Depends on SLIP-070 (done) |
| 40 | SLIP-076 | P1 | 26h | Blocked | Depends on SLIP-075 |
| 41 | SLIP-077 | P0 | 24h | Ready | Depends on SLIP-070 (done) |
| 42 | SLIP-078 | P0 | 14h | Ready | Independent package |
| 43 | SLIP-079 | P0 | 14h | Ready | Independent package |
| 44 | SLIP-080 | P0 | 14h | Ready | Independent package |
| 45 | SLIP-081 | P0 | 14h | Ready | Depends on SLIP-070 (done) |
| 46 | SLIP-082 | P0 | 24h | Blocked | Depends on SLIP-081 |
| 47 | SLIP-083 | P1 | 24h | Blocked | Depends on 073, 075, 081 |
| 48 | SLIP-084 | P1 | 18h | Ready | Depends on SLIP-070 (done) |
| 49 | SLIP-085 | P1 | 14h | Ready | Depends on SLIP-070 (done) |
| 50 | SLIP-086 | P1 | 18h | Blocked | Depends on SLIP-084 |
| 51 | SLIP-087 | P2 | 16h | Blocked | Depends on 073, 075 |

## Integration hardening (2026-11-07)

| Order | ID | P | Hours | Status | Note |
|---|---|---|---|---|---|
| 1 | SLIP-090 | P0 | 3h | Done | validate_usage parser + native attrs |
| 2 | SLIP-091 | P0 | 2h | Done | AppShell rail + Sidebar nested active |
| 3 | SLIP-092 | P1 | 1h | Done | SiteHeader nav labels |
| 4 | SLIP-099 | P0 | 2h | Blocked + external | Needs npm publish auth |
| 5 | SLIP-095 | P1 | 2h | Done | RHF compatibility guide |
| 6 | SLIP-096 | P1 | 3h | Done | Packaged stylesheet smoke test |
| 7 | SLIP-100 | P1 | 1h | Done | Regenerate docs after concurrent work |
| 8 | SLIP-093 | P2 | 4h | Ready | Shell visual regression |
| 9 | SLIP-094 | P2 | 3h | Done | CSS/JS size audit |
| 10 | SLIP-097 | P2 | 6h | Ready | AuthLayout aside variant |
| 11 | SLIP-098 | P3 | 3h | Ready | PageHeader head helper |
| 12 | SLIP-101 | P2 | 1h | Done | React dedupe note for linked checkouts |

## i18n epic (2026-11-07)

| Order | ID | P | Hours | Status | Note |
|---|---|---|---|---|---|
| 1 | SLIP-061 | P1 | 6h | Done | P0 labels: Button, Pagination, DataTable, Dialog, Drawer |
| 2 | SLIP-062 | P1 | 8h | Done | P1 labels: Autocomplete, Breadcrumb, DatePicker/TimePicker, FileUpload, Search, CommandPalette, Toast, Skeleton, AppShell |
| 3 | SLIP-063 | P1 | 5h | Done | Message/Reasoning `formatTime`/`locale` + starter wiring |
| 4 | SLIP-068 | P2 | 8h | Partial | `en-XA` pseudo-locale + playground toggle done; CI axe sweep and visual regression pending |
| 5 | SLIP-064 | P1 | 16h | Partial | Cookie locale, provider, switcher and shell copy done; path-prefixed routes, metadata, hreflang and sitemap pending |
| 6 | SLIP-066 | P2 | 24h | Partial | Dashboard shell and nav done; user locale migration, flows, currency and RTL tables pending |
| 7 | SLIP-067 | P2 | 12h | Blocked | Depends on SLIP-066 user locale |
| 8 | SLIP-065 | P2 | 80h | Blocked | Depends on SLIP-064; guides and 80 component pages need native-speaker review |

**Execution rule:** do not start an issue whose `depends_on` is incomplete. Do not mark an external issue done without the recorded date, version, and evidence.
