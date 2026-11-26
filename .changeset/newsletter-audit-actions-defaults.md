---
"@slipstream-ui/newsletter": patch
---

Align the audit-log content source with actually-emitted audit action names (drop the never-emitted `team.created`, add verified-email/license/apikey revocations) via exported `NEWSLETTER_AUDIT_ACTIONS`, and stop fetching the stub `release`/`custom` sources by default so digests only contain real content.
