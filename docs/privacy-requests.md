# Privacy request runbook

How to receive, verify, and fulfil GDPR/CCPA-style requests for the
Slipstream UI dashboard and docs site. The public commitment (30-day
response window) lives in the privacy policy at
<https://slipstreamui.com/privacy>; this file is the operational side.

> **Intake channel status:** self-service covers access/export and
> deletion today. The email intake address is still a placeholder
> (`SITE.contact.email` in `apps/docs/lib/site.ts`) — until the real
> monitored inbox is provisioned, route inbound requests through
> GitHub issues or the owner directly and record them in the tracker.

## Request types

| Type | Self-service path | Manual path |
|---|---|---|
| Access / export | Settings → Your data → "Export my data (JSON)" (`GET /api/account/export`) | Re-send the export or pull rows directly (below) |
| Deletion | Settings → Your data → "Delete my account" (`DELETE /api/account`) | Admin tooling + `lib/account.ts` logic |
| Correction | Settings → profile name; password change | Admin user edit (`PATCH /api/admin/users/:id`) |
| Marketing opt-out | Cookie preferences (`/privacy` / banner) + newsletter unsubscribe link in every email | `NewsletterSubscription.status = 'unsubscribed'` |

## Identity verification

- **Self-service** is already verified: the session is authenticated and
  deletion additionally requires the account email plus the current
  password (`lib/account.ts`).
- **Email/other-channel requests:** reply only to the address on the
  account, or ask the requester to confirm from that mailbox. For
  deletion requests initiated by someone other than the account holder
  (e.g. a parent, employer, or lawyer), require written authority
  (power of attorney, court order, or employer DPA clause) before
  acting — an email claim alone is not sufficient.
- Never disclose whether an email has an account beyond what the
  requester already proved (the signup/login flows are
  enumeration-safe; keep request handling the same way).

## Where personal data lives

| Store | Keyed by | Contains | Exported? | Deleted with account? |
|---|---|---|---|---|
| `User` | id | email, name, password hash, role, consent record | yes (no hash) | yes (row removed) |
| `Session`, `PasswordResetToken`, `EmailVerificationToken` | userId | token hashes, expiry | no (ephemeral) | cascade |
| `Membership`, `TeamInvite` (sent) | userId / invitedById | team roles, invite tokens | teams listed | cascade / explicit delete |
| `Team` (owned, sole member) | via Membership | billing shell after deletion | team name/slug/role | membership removed; team + payments retained |
| `Subscription`, `Payment` | teamId, userId? | plan, status, amounts | yes | **retained**, userId nulled (financial records) |
| `LicenseKey`, `LicenseActivation` | ownerId | license prefixes, machine ids | prefixes only | license rows deleted, activations cascade |
| `ApiKey` | userId | name, prefix, key hash | prefix only | cascade |
| `MockCheckout` | userId | checkout tokens | no | cascade |
| `NewsletterPreference`, `NewsletterSubscription`, `NewsletterDelivery` | userId | prefs, statuses, sent content | prefs + subscription status | cascade |
| `EmailDelivery` | toEmail | subject, body text/html, headers | no | explicit delete by address |
| `AuditLog` | actorId? | action, target, metadata JSON | last 200 actions | **retained**, actorId nulled |
| `MetricSnapshot` | day | aggregate business metrics | no | no per-user data |

## Deletion semantics (`apps/app/src/lib/account.ts`)

`DELETE /api/account` requires `{ confirmEmail, password? }` and:

1. Refuses `ADMIN` accounts (demote first) and impersonated sessions.
2. Cancels subscriptions on teams the user solely owns (mock: instant
   downgrade; Stripe: `cancel_at_period_end` — access continues to
   period end per the billing terms).
3. Promotes the longest-tenured `ADMIN` to `OWNER` on shared teams the
   user owns; refuses deletion when no admin successor exists.
4. Deletes license keys, sent/received invites, and `EmailDelivery`
   rows for the address inside one transaction, writes an
   `account.delete` audit row, then removes the user (cascades handle
   the rest; payments/subscriptions/audit logs survive with the user
   link nulled).

## Manual/admin procedures

- **Find a user:** `prisma.user.findUnique({ where: { email } })` or
  admin UI `/admin/users`.
- **Suspend instead of delete** when investigation is pending:
  `PATCH /api/admin/users/:id` with `suspendedAt`.
- **Audit lookup:** `AuditLog` has no email column — resolve user id
  first, then `auditLog.findMany({ where: { actorId } })`. During
  impersonation, `metadata.impersonatedBy` records the admin.
- **Email deliveries:** search `EmailDelivery` by `toEmail`; bodies may
  contain action links — handle as sensitive, never paste into tickets.

## Response templates

**Acknowledgement**

> Thanks for your privacy request. We will verify your identity and
> respond within 30 days. If you have an account, the fastest path is
> Settings → Your data in the dashboard, which exports or deletes your
> data immediately.

**Completion (self-service already used)**

> Your export/deletion was completed on <date> via the self-service
> controls. Payment and audit records are retained with your identity
> removed, as described in the privacy policy.

**Partial refusal**

> We can fulfil <X> but must retain <Y> for legal/accounting obligations
> (e.g. completed payment records, security audit logs). Retained data
> has your direct identifiers removed where the schema allows.

## Record keeping

Log every request (date, type, channel, verification method, outcome)
in the team's ticket tracker. Admin-side actions are already in
`AuditLog`; requester correspondence is not — keep it in the ticket.
