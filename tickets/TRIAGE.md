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

**Execution rule:** do not start an issue whose `depends_on` is incomplete. Do not mark an external issue done without the recorded date, version, and evidence.