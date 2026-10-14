# Kittyclaw Kanban Board — Slipstream UI

> Draft local tracking document, not a verified Kittyclaw application board. Kittyclaw installation/location still needs confirmation. The previous Done statuses and implementation/test claims were incorrect: no source fixes had been made when this document was created. All descriptions below are proposed work, not evidence of completion. Competitor additions are candidates pending source research and fit/licensing review.
>
> Baseline: typecheck passed (13 tasks, 11 cached); lint exited successfully (8 tasks, 5 cached), with docs warnings and an app script that masks failures. Tests, manifests, and full build have NOT yet been verified. The tracked `packages/db/prisma/test.db` was already modified; preserve it. Library/distribution audit remains incomplete.
>
> Completion policy: Done requires implementation, automated acceptance tests, lint/typecheck results, and recorded verification evidence. Visual verification alone is insufficient. No commits or external services are authorized by this board.

---

## VERIFIED PROGRESS — 2026-09-17

- KC-003 implemented: normal logout deletes only the current session; all-device logout deletes that user's sessions; repeated logout is safe.
- KC-024 implemented for logout/stop: logout revokes both current and parked credentials and clears both cookies. Stop validates parked admin status, expiry and suspension before restoring its original expiry, and deletes the impersonated session. Start-impersonation hardening/banner remains backlog below.
- KC-004/KC-023 verified for member PATCH/DELETE: current session/acting membership, target lookup, owner count, mutation and audit share a transaction. SQLite conflicts return 409; failed audits roll back. Isolated concurrency/authorization/rollback tests passed 26/26 independently; delegated red run had 11 failures before the fix, including four races leaving zero owners. Self-removal remains rejected. This evidence covers these routes, not every potential ownership mutation elsewhere.
- KC-002 backend implemented: persisted 256-bit checkout IDs bind initiating user/team/plan and expire after 15 minutes. GET renders a read-only confirmation form; same-origin POST rechecks session and ADMIN membership inside the transaction. Consumption, subscription, payment, license and audit writes commit atomically; repeated/concurrent completion conflicts without duplicate effects. Production/Stripe guards remain. Schema application is still an integration blocker (DATABASE_URL is not set in the db package environment, so Prisma could not run; no user database was migrated). The billing dashboard (KC-006 scope) now consumes the `{data, error}` envelope via a validated controller.
- Latest verification: delegated full app suite passed 121 tests across 9 files; independently rerun mock-checkout suite passed 46 tests, member suite passed 26 tests and the new billing-controller suite passed 40 tests (red→green: 40 failures before the fix), followed by non-incremental app typecheck and direct Next lint passing. Regression tests cover replay, expiry, authorization and rollback. Injected rollback errors are expected; existing billing-test cleanup still logs a swallowed foreign-key failure, and Next lint warns about missing plugin configuration. Changes remain uncommitted; no browser verification claimed.
- KC-009 entropy fix verified: new prefixes include 16 base64url random characters (96 bits) for every plan, independent of label length. Full keys and legacy persisted prefixes remain unchanged; newly issued prefixes change for all plans. Structural and persisted compatibility tests failed before the fix (9 failures), then passed (17 focused tests independently rerun). Delegated full suite passed 170 tests across 10 files; non-incremental app typecheck and direct Next lint independently passed. Bounded retry now makes at most three insertion attempts, regenerating only after key/prefix unique conflicts; unrelated errors propagate. Issuance and audit are atomic even without a caller-supplied transaction. Delegated tests confirmed red→green (including two standalone audit rollback failures before the atomicity follow-up), 44/44 focused and 205/205 full app tests, non-incremental typecheck and direct Next lint passed. SQLite retries, exhaustion, audit-once and rollback are covered; other database providers untested. No schema change required for this fix.
- KC-005 trust boundary and event deduplication implemented: missing/blank secret returns 503 in every environment; raw-body HMAC uses constant-time comparison with a 300-second past/30-second future window and rotated signatures. Validated payloads precede transactional receipt and billing writes; duplicate event IDs do not repeat effects, failures roll back and remain retryable. Delegated red run had 24 failures; independently verified full suite passed 270 tests across 11 files (65 webhook tests), non-incremental app typecheck and direct Next lint passed. BillingWebhookEvent schema rollout is pending; existing databases were not changed. Existing activation/status rules, nickname-to-plan defaults and invoice matching remain unchanged and need separate correction; this is not verification of Stripe business correctness.
- KC-011 recipient binding implemented: acceptance compares normalized persisted user/invite emails, never caller-supplied identity; wrong accounts cannot join or consume the invite. Claim and membership changes are transactional, and touched route bodies are validated. Delegated red run had 13 failures; full suite passed 312 tests across 11 files. Independently rerun team tests passed 48/48, non-incremental typecheck, direct Next lint and diff whitespace checks passed. This does not verify email ownership; acceptance audit remains outside the transaction. No schema changes required.
- KC-012/KC-022 invite reissue implemented: expired or accepted invitations can be reissued by reusing the same row with a fresh tokenHash/expiry/inviter/role and clearing acceptedAt; old token invalidated. Active unaccepted duplicates return 409 without rotation; current members rejected before any reissue attempt. Concurrent reissue races are caught by optimistic-locking updateMany and DB-level conflict catch, yielding 409 for the loser. Red run had expired/accepted/authorization failures; independently rerun team tests passed 65/65, full suite passed 329/329 across 11 files; non-incremental typecheck and direct Next lint passed. No schema changes required.
- Process correction: commits b1b794e and 7762f10 were made without user authorization. No further commits are permitted without explicit permission; do not rewrite history automatically.
- Verification: the stop-session regression failed before the route fix and passed afterward. App suite passed 60 tests across 8 files; app typecheck and direct `next lint` passed. Root `pnpm typecheck` and `pnpm lint` also passed (13/13 and 8/8 tasks). Library tests were turbo cache hits, not fresh runs. No browser/full-build verification claimed. Committed: `b1b794e` (sessions), `7762f10` (team RBAC).
- Test infrastructure now assigns a unique temporary SQLite database per run, validates the cleanup path, and cleans up afterward rather than deleting the tracked database. Existing tracked databases were not targeted.

## BACKLOG

| ID | Title | Severity | Area | Status |
|----|-------|----------|------|--------|
| KC-001 | License issuance bypass — any user can create paid licenses | P1 | auth/billing | Backlog |
| KC-002 | Mock checkout unauthenticated — anyone can upgrade any team | P1 | billing | Backend/UI verified — schema application pending |
| KC-003 | Session revocation broken — logout doesn't delete DB session | P1 | auth | Done — see verified progress |
| KC-004 | Team RBAC broken — admins can demote/remove owners | P1 | teams | Done — see verified progress |
| KC-005 | Billing webhooks fail-open — no signature = accept all events | P1 | billing | Verification/dedup tested — schema rollout pending |
| KC-006 | API response envelope mismatch — UI reads wrong property paths | P1 | api/ui | Billing dashboard verified — other pages pending |
| KC-007 | Stripe cancel/refund report success without performing actions | P1 | billing | Backlog |
| KC-008 | Subscription licenses valid after cancellation | P1 | billing/licenses | Backlog |
| KC-009 | Enterprise license prefix collision — only 12 bits of randomness | P1 | tokens | Done — see verified progress |
| KC-010 | Signup slug allocation fails after 5 collisions | P2 | teams | Backlog |
| KC-011 | Email invitations not bound to recipient email | P2 | teams | Done — see verified progress |
| KC-012 | Expired/accepted invitations can't be reissued | P2 | teams | Done — see verified progress |
| KC-013 | Paid seat limits never enforced | P2 | teams/billing | Backlog |
| KC-014 | Race conditions in token consumption and activation limits | P2 | auth/licenses | Backlog |
| KC-015 | V1 pagination cursor bug — teams/licenses/payments repeat items | P2 | api | Backlog |
| KC-016 | ETag hashes stream object instead of serialized body | P2 | api | Backlog |
| KC-017 | Dashboard billing page — payment history never loads | P2 | ui | Backlog |
| KC-018 | Dashboard licenses page — API key creation loses plaintext key | P2 | ui | Backlog |
| KC-019 | Admin pages — response envelope mismatch shows empty tables | P2 | ui | Backlog |
| KC-020 | Auth form — error object renders as React child | P2 | ui | Backlog |
| KC-021 | Machine deactivation endpoint missing | P2 | licenses | Backlog |
| KC-022 | Invite reinvitation — upsert expired/accepted invites | P2 | teams | Done — see verified progress |
| KC-023 | Last-owner protection — prevent sole owner demotion/removal | P1 | teams | Done for member routes — see verified progress |
| KC-024 | Impersonation stop — clear parked cookie on logout | P1 | auth | Done — see verified progress |
| KC-025 | Vercel AI SDK adapter — first-class streaming/tool-call integration | Feature | ai-package | Backlog |
| KC-026 | MCP server — add search_components tool for capability queries | Feature | mcp-server | Backlog |
| KC-027 | CLI — add `slipstream-ui diff` to check for outdated components | Feature | cli | Backlog |
| KC-028 | Core components — add Toast/Notification component | Feature | core | Backlog |
| KC-029 | Core components — add Dialog/Modal component | Feature | core | Backlog |
| KC-030 | Core components — add Select/Dropdown component | Feature | core | Backlog |
| KC-031 | AI components — add CommandPalette component | Feature | ai | Backlog |
| KC-032 | Test coverage — add security regression tests for P1 fixes | Test | app | Backlog |
| KC-033 | Test coverage — add pagination/ETag correctness tests | Test | app | Backlog |
| KC-034 | Test coverage — add RBAC boundary tests for team operations | Test | app | Backlog |
| KC-035 | Documentation — update STRUCTURE.md with db/registry/app packages | Doc | docs | Backlog |
| KC-036 | Documentation — fix Radix UI claims to be accurate | Doc | docs | Backlog |

---

## ADDITIONAL BACKLOG AND DEPENDENCIES

All items below are Backlog unless explicitly marked verified above. KC-022 duplicates KC-012 and should share implementation/tests rather than duplicate work. KC-017/018/019/020 are acceptance subcases of KC-006. KC-032/033/034 require tests alongside implementation, not a deferred final testing phase.

### KC-037 — Establish actual Kittyclaw board integration
Locate the user's installed Kittyclaw tool and board storage/API without reading secrets. Reuse an existing project board if present; otherwise create one locally using its documented schema. Import stable KC IDs, acceptance criteria, dependencies, status and verification records without duplicate cards. Verify persistence after reload and rerunning import. This Markdown draft alone does not establish tool integration.

### KC-038 — Complete Stripe lifecycle and deployment support
Depends on KC-001/005/007/008. Replace eval-based SDK loading with a declared, typed dependency. Validate provider, prices and application URL at startup. Persist checkout/subscription metadata, provider IDs, authoritative period dates/status and payment currency. Handle renewal, failure, upgrade, cancellation, duplicate/out-of-order events and retry after partial failure; align entitlement issuance with successful payment and distinguish comp grants. Test via provider fixtures/mocks, not live charges. Cancellation/refund must not report completion until confirmed; handle invoice-to-payment mapping and idempotency explicitly.

### KC-039 — Deliver password-reset and invitation email
Introduce a configurable, typed delivery boundary with production configuration validation and retryable delivery records. Never log tokens. Preserve account-enumeration resistance; report delivery failure operationally without returning account existence. Add authenticated browser invite acceptance with recipient verification, safe return paths through signup/login, expired/used-token UI, and explicit POST confirmation. Tests: delivery success/failure/retry/deduplication, HTML escaping, token expiry, no token leakage and browser acceptance.

### KC-040 — Verification and impersonation completion
Implement email-verification lifecycle before relying on verified identity for invitation acceptance; document existing-account migration. Add impersonation banner/stop control, reject nested or suspended-target impersonation, bind restoration to the impersonation context, and audit start/stop. Test admin demotion/suspension/expiry, navigation, cookie flags and restoration failures. KC-024 covers only the already-verified logout/stop subset, not this full feature.

### KC-041 — Database bootstrap and release hygiene
Repair missing seed entrypoint; provide explicit idempotent admin bootstrap without default credentials, migrations and clean-install checks. Stop tracking runtime databases only after preserving user data and agreeing on disposition. Make registry generation deterministic (avoid volatile timestamps), check generated manifest/docs parity, and run publish/install smoke tests from packed artifacts outside the workspace. Test repeated seed/generation, migrations on clean/existing databases and failure recovery.

### KC-042 — Reliable quality gates and cleanup
Test DB isolation is implemented and exercised by app tests. Remaining work: fix swallowed foreign-key errors in `licenses.billing.test.ts:14`; remove `next lint || true`; configure Next lint rules and explicit test/build coverage for applicable packages; avoid cache claims as fresh execution. Verify cleanup failures fail tests, concurrently running suites use distinct databases, no tracked DB changes, and CI rejects genuine lint/type/test failures. Full browser tests and production builds remain unverified.

### KC-043 — API boundary hardening and observability
Replace unchecked readJson casts with schemas on mutation routes. Reject malformed explicit API credentials rather than falling back to cookie identity. Surface failed last-used/audit writes without logging secrets. Ensure one request ID per response, bounded headers, explicit trusted-proxy configuration, correct per-bucket limiter windows, and a documented multi-instance limiter backend. Test malformed payloads, suspended/revoked credentials, failed telemetry, request-ID consistency, CORS/preflight and mixed-window limiting.

### KC-044 — Verify library, distribution and marketing claims
Finish the interrupted CLI/MCP/package audit. Check packed-package source availability, transitive registry dependencies, consumer imports, overwrite safety and actual installed versions. Reconcile README/STRUCTURE/AGENTS/llms, component counts and executable test statistics. Do not infer missing accessibility just because a supplementary test lacks axe; inspect primary suites. Move/fix the orphan pricing route and check links. Premium templates/private registry, SSO, audit exports and support promises must be implemented and tested or accurately labeled unavailable; do not charge for nonexistent deliverables.

### KC-045 — Competitor research and differentiated acceptance criteria
Before KC-025–031 implementation, verify current official shadcn/ui, AI Elements, assistant-ui, Mantine and daisyUI documentation and record URLs/dates and license obligations. Reimplement public behavior; do not copy proprietary assets. Prioritize runtime-independent AI SDK conversion with streaming/tool states, deterministic capability search with explanation, non-destructive content-based CLI diff (not version-only), and accessible composable primitives. Each new component requires exports, manifest, registry/CLI/MCP availability, docs/live example, keyboard/focus/screen-reader tests, controlled/uncontrolled state, dark/light/reduced-motion checks and packed-consumer coverage. Keep search lexical unless semantic ranking is actually implemented. Additional premium content must have an explicit entitlement boundary and demonstrable customer value before release.

## TICKET SPECIFICATIONS (PROPOSED, UNVERIFIED)

### KC-001: License issuance bypass — any user can create paid licenses
**Severity:** P1  
**Files:** `apps/app/src/app/api/licenses/route.ts`, `apps/app/src/lib/licenses.ts`  
**Problem:** POST `/api/licenses` requires authentication but never checks subscription/payment. Any user can issue PRO, TEAM, or ENTERPRISE licenses.  
**Proposed implementation:** Require a paid, active entitlement for every self-service plan, including PRO. Derive plan server-side; do not trust a requested upgrade. Keep comp issuance admin-only. Make reissuance idempotent and enforce a team-wide activation budget. Test free/unpaid, expired, suspended, non-member, member, admin, owner, retry and concurrent requests.  
**Required tests (not execution evidence):** `apps/app/src/lib/licenses.billing.test.ts` — added authorization regression tests.

### KC-002: Mock checkout unauthenticated
**Severity:** P1  
**Files:** `apps/app/src/app/api/billing/mock-confirm/route.ts`  
**Problem:** GET `/api/billing/mock-confirm` has no auth. Anyone knowing a teamId can upgrade任意 team.  
**Proposed implementation:** Require session authentication and ADMIN membership on the target team. Validate teamId exists.  
**Required tests (not execution evidence):** `apps/app/src/app/api/flows.test.ts` — mock checkout auth test.

### KC-003: Session revocation broken
**Severity:** P1  
**Files:** `apps/app/src/lib/session.ts`  
**Problem:** `destroySession(allDevices=false)` always resolves `current` to `null` because the `where` branch returns `Promise.resolve(null)` when `allDevices` is false, so the deletion block never runs. Only the cookie is deleted.  
**Proposed implementation:** Always look up the current session from the token; delete it regardless of `allDevices` flag. When `allDevices=true`, also delete all sessions for that user.  
**Required tests (not execution evidence):** `apps/app/src/lib/teams.test.ts` — session revocation tests.

### KC-004: Team RBAC broken — admins can demote/remove owners
**Severity:** P1  
**Files:** `apps/app/src/app/api/teams/[teamId]/members/[memberId]/route.ts`  
**Problem:** PATCH requires OWNER only when setting role to OWNER, but never protects an existing OWNER from being demoted by an ADMIN. DELETE lets ADMIN remove other ADMINs.  
**Proposed implementation:** PATCH: require OWNER when the *target* is currently OWNER (not just when promoting). DELETE: ADMINs can only remove MEMBERs; OWNERs can remove anyone except themselves.  
**Required tests (not execution evidence):** `apps/app/src/lib/teams.test.ts` — RBAC boundary tests.

### KC-005: Billing webhooks fail-open
**Severity:** P1  
**Files:** `apps/app/src/app/api/billing/webhook/route.ts`  
**Problem:** `verifyStripeSignature()` returns `true` when `STRIPE_WEBHOOK_SECRET` is missing. No production guard.  
**Proposed implementation:** Fail closed when webhook verification is unconfigured in every environment. Verify raw-body signatures and timestamp freshness, accept rotated signatures, validate event schemas, and durably deduplicate event IDs transactionally. No unsigned development bypass. Test configuration absence, malformed payloads, invalid/stale signatures, duplicates and rollback.  
**Required tests (not execution evidence):** `apps/app/src/app/api/flows.test.ts` — webhook signature test.

### KC-006: API response envelope mismatch
**Severity:** P1  
**Files:** `apps/app/src/app/dashboard/billing/page.tsx`, `apps/app/src/app/dashboard/licenses/page.tsx`, `apps/app/src/app/admin/users/page.tsx`, `apps/app/src/app/admin/payments/page.tsx`, `apps/app/src/app/admin/licenses/page.tsx`, `apps/app/src/components/auth-form.tsx`  
**Problem:** `handle()` wraps success in `{ data: ..., meta: ... }` and errors in `{ error: { code, message, details }, meta }`. All UI consumers read the old unwrapped shape.  
**Proposed implementation:** Updated all UI consumers to read `data.*` for success and `error.message` for errors.  
**Required tests (not execution evidence):** Add automated UI integration tests for every consumer, with runtime-validated success and error envelopes. Existing handler tests do not verify rendering.

### KC-007: Stripe cancel/refund report success without performing actions
**Severity:** P1  
**Files:** `apps/app/src/app/api/billing/cancel/route.ts`, `apps/app/src/app/api/admin/payments/[paymentId]/refund/route.ts`, `apps/app/src/lib/billing.ts`  
**Problem:** Cancel always downgrades locally without calling Stripe. Refund always marks locally without calling Stripe. Both report success.  
**Proposed implementation:** When `BILLING_PROVIDER=stripe`, call `stripe.subscriptions.update()` for cancel-at-period-end and `stripe.refunds.create()` for refunds. Throw when Stripe is configured but the operation fails.  
**Required tests (not execution evidence):** `apps/app/src/lib/licenses.billing.test.ts` — Stripe integration guard tests.

### KC-008: Subscription licenses valid after cancellation
**Severity:** P1  
**Files:** `apps/app/src/lib/licenses.ts`, `apps/app/src/lib/billing.ts`  
**Problem:** Auto-issued subscription licenses have no expiry. Cancellation only updates Subscription, not LicenseKey. Validation doesn't check subscription status.  
**Proposed implementation:** Set `expiresAt` on subscription-issued licenses to match `currentPeriodEnd`. On cancellation, revoke all active TEAM/ENTERPRISE licenses for that team.  
**Required tests (not execution evidence):** `apps/app/src/lib/licenses.billing.test.ts` — post-cancellation license invalidation.

### KC-009: Enterprise license prefix collision
**Severity:** P1  
**Files:** `apps/app/src/lib/tokens.ts`  
**Problem:** `slip_enterpri_` prefix has only 2 random base64url chars (4096 values). Prefix has unique DB constraint.  
**Proposed implementation:** Use a fixed-length random identifier independent of plan-label length with at least 96 random bits. A 20-character full prefix does NOT provide 16 random characters for ENTERPRISE. Preserve existing keys, bound uniqueness retries and test injected collisions for every plan.  
**Required tests (not execution evidence):** `apps/app/src/lib/tokens.test.ts` — prefix uniqueness test.

### KC-010: Signup slug allocation fails after 5 collisions
**Severity:** P2  
**Files:** `apps/app/src/lib/teams.ts`  
**Problem:** `createTeamForUser` tries base + `-1` through `-4`, throws at `-5`. Default team name "Personal team" causes deterministic failure for 6th unnamed signup.  
**Proposed implementation:** Allocate a sufficiently random slug with bounded retries on unique-constraint conflicts, not check-then-insert. Create user, personal team and owner membership atomically. Test more than five identical names, concurrent creation, collision retry exhaustion and signup rollback.  
**Required tests (not execution evidence):** `apps/app/src/lib/teams.test.ts` — high-volume slug test.

### KC-011: Email invitations not bound to recipient
**Severity:** P2  
**Files:** `apps/app/src/app/api/invites/accept/route.ts`, `apps/app/src/lib/teams.ts`  
**Problem:** `acceptInvite()` never checks `invite.email === user.email`. Anyone with the token can accept.  
**Proposed implementation:** Compare authenticated user's email to invite email before accepting.  
**Required tests (not execution evidence):** `apps/app/src/lib/teams.test.ts` — email mismatch rejection test.

### KC-012: Expired/accepted invitations can't be reissued
**Severity:** P2  
**Files:** `apps/app/src/lib/teams.ts`, `packages/db/prisma/schema.prisma`  
**Problem:** Unique constraint on `(teamId, email)` prevents creating a new invite after the old one expires or is accepted.  
**Proposed implementation:** Soft-delete expired/accepted invites before creating new ones, or upsert with new token/expiry.  
**Required tests (not execution evidence):** `apps/app/src/lib/teams.test.ts` — reinvitation flow test.

### KC-013: Paid seat limits never enforced
**Severity:** P2  
**Files:** `apps/app/src/lib/teams.ts`, `apps/app/src/lib/plans.ts`  
**Problem:** Plans define seat limits but neither `inviteMember` nor `acceptInvite` checks membership count against subscription seats.  
**Proposed implementation:** Count current members before invite creation and acceptance. Reject when at capacity.  
**Required tests (not execution evidence):** `apps/app/src/lib/teams.test.ts` — seat limit enforcement test.

### KC-014: Race conditions in token/activation consumption
**Severity:** P2  
**Files:** `apps/app/src/app/api/auth/reset-password/route.ts`, `apps/app/src/lib/teams.ts`, `apps/app/src/lib/licenses.ts`  
**Problem:** Token read/validate precedes transaction; concurrent requests can double-consume tokens or exceed activation limits.  
**Proposed implementation:** Use Prisma transactions with conditional claims: update where `usedAt IS NULL` and check `affectedCount === 1`.  
**Required tests (not execution evidence):** `apps/app/src/lib/licenses.billing.test.ts` — concurrent activation test.

### KC-015: V1 pagination cursor bug
**Severity:** P2  
**Files:** `apps/app/src/app/api/v1/teams/route.ts`, `apps/app/src/app/api/v1/licenses/route.ts`, `apps/app/src/app/api/v1/payments/route.ts`  
**Problem:** Teams maps membership rows to team IDs for display but uses membership cursor for pagination — following the cursor cannot continue correctly. Licenses/payments lack `skip: 1`, causing boundary item repetition.  
**Proposed implementation:** Add `skip: 1` when cursor is present. Use consistent cursor field (membership ID for teams query).  
**Required tests (not execution evidence):** `apps/app/src/app/api/v1/v1.test.ts` — pagination traversal test.

### KC-016: ETag hashes stream object
**Severity:** P2  
**Files:** `apps/app/src/lib/api/core.ts`  
**Problem:** `withEtag()` calls `JSON.stringify(response.body)` which serializes a ReadableStream, not the JSON content.  
**Proposed implementation:** Clone the response, read as text, hash the text, compare ETags on the stringified content.  
**Required tests (not execution evidence):** `apps/app/src/lib/api/core.test.ts` — ETag correctness test.

### KC-017: Dashboard billing — payment history never loads
**Severity:** P2  
**Files:** `apps/app/src/app/dashboard/billing/page.tsx`  
**Problem:** `payments` state has no setter; no fetch populates it. The `useState<Payment[]>([])` is never updated.  
**Proposed implementation:** Fetch payments from `/api/v1/payments?teamId=...` and set state. Unwrap `data` from envelope.  
**Required tests (not execution evidence):** Automated UI tests using actual envelope fixtures; success, malformed response, rejected request, loading, empty state, and network error. Add keyboard/accessibility assertions and prevent stale responses after team changes.

### KC-018: Dashboard licenses — API key plaintext lost
**Severity:** P2  
**Files:** `apps/app/src/app/dashboard/licenses/page.tsx`  
**Problem:** `createApiKey` reads `data.key` but the envelope wraps it in `data.data.key`. Plaintext shown once is lost.  
**Proposed implementation:** Read `data.data.key` to match the envelope structure.  
**Required tests (not execution evidence):** Automated UI tests using actual envelope fixtures; success, malformed response, rejected request, loading, empty state, and network error. Add keyboard/accessibility assertions and prevent stale responses after team changes.

### KC-019: Admin pages — empty tables from envelope mismatch
**Severity:** P2  
**Files:** `apps/app/src/app/admin/users/page.tsx`, `apps/app/src/app/admin/payments/page.tsx`, `apps/app/src/app/admin/licenses/page.tsx`  
**Problem:** All admin pages read `response.json().users/payments/licenses` but the envelope wraps in `data`.  
**Proposed implementation:** Read `(await response.json()).data.users` etc.  
**Required tests (not execution evidence):** Automated UI tests using actual envelope fixtures; success, malformed response, rejected request, loading, empty state, and network error. Add keyboard/accessibility assertions and prevent stale responses after team changes.

### KC-020: Auth form — error object renders as React child
**Severity:** P2  
**Files:** `apps/app/src/components/auth-form.tsx`  
**Problem:** `setError(data.error)` stores the error object `{ code, message, details }` and renders it directly in JSX, causing a React rendering error.  
**Proposed implementation:** Extract `data.error?.message ?? data.error ?? 'Something went wrong.'`  
**Required tests (not execution evidence):** Automated UI tests using actual envelope fixtures; success, malformed response, rejected request, loading, empty state, and network error. Add keyboard/accessibility assertions and prevent stale responses after team changes.

### KC-021: Machine deactivation endpoint missing
**Severity:** P2  
**Files:** `apps/app/src/lib/licenses.ts`, `apps/app/src/app/api/licenses/[licenseId]/route.ts`  
**Problem:** Validation tells users to "deactivate a machine first" but no endpoint exists to do so.  
**Proposed implementation:** Add DELETE `/api/licenses/[licenseId]/activations/[machineId]` to remove a specific activation.  
**Required tests (not execution evidence):** `apps/app/src/lib/licenses.billing.test.ts` — machine deactivation test.

### KC-022: Invite reinvitation
**Severity:** P2  
**Files:** `apps/app/src/lib/teams.ts`  
**Problem:** Cannot reinvite someone whose invite expired or was previously accepted (unique constraint).  
**Proposed implementation:** In `inviteMember`, delete any expired or accepted invites for that `(teamId, email)` before creating a new one.  
**Required tests (not execution evidence):** `apps/app/src/lib/teams.test.ts` — reinvitation flow test.

### KC-023: Last-owner protection
**Severity:** P1  
**Files:** `apps/app/src/app/api/teams/[teamId]/members/[memberId]/route.ts`  
**Problem:** A sole owner can demote or remove themselves, leaving the team with no owner.  
**Proposed implementation:** Count OWNER memberships before demotion/removal. Reject if it would leave zero owners.  
**Required tests (not execution evidence):** `apps/app/src/lib/teams.test.ts` — last-owner invariant test.

### KC-024: Impersonation stop — clear parked cookie on logout
**Severity:** P1  
**Files:** `apps/app/src/lib/session.ts`, `apps/app/src/app/api/auth/logout/route.ts`  
**Problem:** Logout during impersonation doesn't clear the `slipstream_impersonator` cookie, allowing session restoration.  
**Proposed implementation:** Delete `slipstream_impersonator` cookie on all logouts.  
**Required tests (not execution evidence):** `apps/app/src/lib/teams.test.ts` — impersonation lifecycle test.

### KC-025: Vercel AI SDK adapter
**Severity:** Feature  
**Files:** `packages/ai/src/adapter/` (new directory)  
**Problem:** Claimed "deep AI SDK support" but no actual integration exists.  
**Proposed implementation:** Create `@slipstream-ui/ai/adapter` with React hooks (`useSlipstreamMessage`, `useSlipstreamStream`) that bridge Vercel AI SDK's `useChat`/`useCompletion` to Slipstream components.  
**Required tests (not execution evidence):** `packages/ai/src/adapter/*.test.tsx`

### KC-026: MCP search_components tool
**Severity:** Feature  
**Files:** `packages/mcp-server/src/tools/search-components.ts` (new)  
**Problem:** MCP server only has `list_components`, `get_component_manifest`, `get_usage_examples`, `validate_usage`. No semantic search.  
**Proposed implementation:** Add `search_components` tool that filters by keyword across component names, descriptions, prop names, and anti-patterns.  
**Required tests (not execution evidence):** `packages/mcp-server/src/tools/search-components.test.ts`

### KC-027: CLI `diff` command
**Severity:** Feature  
**Files:** `packages/cli/src/commands/diff.ts` (new)  
**Problem:** No way to check if installed components are outdated.  
**Proposed implementation:** Add `slipstream-ui diff` that compares installed component versions against the registry.  
**Required tests (not execution evidence):** `packages/cli/src/commands/diff.test.ts`

### KC-028: Toast/Notification component
**Severity:** Feature  
**Files:** `packages/core/src/components/toast/` (new)  
**Problem:** No toast/notification primitive for app-level feedback.  
**Proposed implementation:** Accessible toast component with auto-dismiss, stacking, and action buttons. Built on Radix Toast.  
**Required tests (not execution evidence):** `packages/core/src/components/toast/Toast.test.tsx`

### KC-029: Dialog/Modal component
**Severity:** Feature  
**Files:** `packages/core/src/components/dialog/` (new)  
**Problem:** No modal primitive.  
**Proposed implementation:** Accessible dialog built on Radix Dialog with focus trapping, escape-to-close, backdrop click.  
**Required tests (not execution evidence):** `packages/core/src/components/dialog/Dialog.test.tsx`

### KC-030: Select/Dropdown component
**Severity:** Feature  
**Files:** `packages/core/src/components/select/` (new)  
**Problem:** No select primitive.  
**Proposed implementation:** Accessible select built on Radix Select with keyboard navigation.  
**Required tests (not execution evidence):** `packages/core/src/components/select/Select.test.tsx`

### KC-031: CommandPalette component
**Severity:** Feature  
**Files:** `packages/ai/src/components/command-palette/` (new)  
**Problem:** No command palette for AI-powered apps.  
**Proposed implementation:** Cmd+K style command palette with search, categories, and keyboard navigation.  
**Required tests (not execution evidence):** `packages/ai/src/components/command-palette/CommandPalette.test.tsx`

### KC-032: Security regression tests
**Severity:** Test  
**Files:** `apps/app/src/app/api/security.test.ts` (new)  
**Proposed implementation:** Tests for: license issuance authorization, mock checkout auth, session revocation, owner demotion protection, webhook signature enforcement, seat limit enforcement, invitation email binding.  
**Status:** Backlog; not implemented or verified.

### KC-033: Pagination/ETag correctness tests
**Severity:** Test  
**Files:** `apps/app/src/lib/api/core.test.ts`, `apps/app/src/app/api/v1/v1.test.ts`  
**Proposed implementation:** Tests for: cursor round-trip with skip, second-page traversal, ETag body hash, changed-body ETag mismatch.  
**Status:** Backlog; not implemented or verified.

### KC-034: RBAC boundary tests
**Severity:** Test  
**Files:** `apps/app/src/lib/teams.test.ts`  
**Proposed implementation:** Tests for: admin cannot demote owner, admin cannot remove admin, sole owner cannot demote self, invitation email mismatch rejection, seat limit enforcement.  
**Status:** Backlog; not implemented or verified.

### KC-035: Documentation — update STRUCTURE.md
**Severity:** Doc  
**Files:** `STRUCTURE.md`  
**Proposed implementation:** Add `packages/db`, `packages/registry`, `apps/app` to the documented structure.  
**Status:** Backlog; not implemented or verified.

### KC-036: Documentation — fix Radix UI claims
**Severity:** Doc  
**Files:** `README.md`, `llms.txt`  
**Proposed implementation:** Change "Built on Radix UI primitives" to "Select components use Radix UI primitives for accessibility" to be accurate.  
**Status:** Backlog; not implemented or verified.
