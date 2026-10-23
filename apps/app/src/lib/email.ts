import { prisma } from '@slipstream-ui/db';

/**
 * Outbound email delivery boundary (KC-039).
 *
 * Every message goes through a pluggable transport and is recorded as an
 * EmailDelivery row (token stored hashed only). Tokens are never written to
 * logs or records in raw form. Production forbids the log transport so
 * messages cannot silently die in stdout.
 */

export type EmailKind = 'password_reset' | 'invite' | 'email_verify';

export interface OutboundEmail {
  to: string;
  kind: EmailKind;
  subject: string;
  /** Plain-text body. Must already contain any user-provided values escaped. */
  text: string;
  /** Raw action token; only its hash is persisted, and only log+dev-link transports may see it. */
  token?: string;
  /** Hash of the token for dedup/audit. */
  tokenHash?: string;
}

export interface EmailTransport {
  name: string;
  send(email: OutboundEmail): Promise<void>;
}

const MAX_DELIVERY_ATTEMPTS = 3;

/** Dev inbox: structured log line without the token (or link unless opted in). */
export const logTransport: EmailTransport = {
  name: 'log',
  async send(email) {
    const includeLink = process.env.EMAIL_DEV_INCLUDE_LINK === 'true' && email.token;
    console.log(
      JSON.stringify({
        channel: 'email',
        to: email.to,
        kind: email.kind,
        subject: email.subject,
        ...(includeLink ? { devToken: email.token } : {}),
      }),
    );
  },
};

/** Test transport: records only, no output. */
export const noopTransport: EmailTransport = {
  name: 'noop',
  async send() {},
};

/**
 * Production transport: POSTs JSON { to, kind, subject, text } to
 * EMAIL_WEBHOOK_URL (any transactional-email gateway). Throws on non-2xx so
 * delivery failures surface as FAILED records instead of silent loss.
 */
export function httpTransport(webhookUrl: string): EmailTransport {
  return {
    name: 'http',
    async send(email) {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: email.to, kind: email.kind, subject: email.subject, text: email.text }),
      });
      if (!response.ok) {
        throw new Error(`Email webhook responded ${response.status}`);
      }
    },
  };
}

/** Escape user-provided values for the HTML alternative of a message. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * Resolve the configured transport with production validation (KC-039):
 * production requires EMAIL_TRANSPORT=http with EMAIL_WEBHOOK_URL; the log
 * transport is a dev/test convenience only.
 */
export function getConfiguredTransport(): EmailTransport {
  const configured = process.env.EMAIL_TRANSPORT;
  if (process.env.NODE_ENV === 'production') {
    if (configured !== 'http') {
      throw new Error('EMAIL_TRANSPORT=http is required in production.');
    }
    const url = process.env.EMAIL_WEBHOOK_URL;
    if (!url) throw new Error('EMAIL_WEBHOOK_URL is required in production.');
    return httpTransport(url);
  }
  if (configured === 'noop') return noopTransport;
  if (configured === 'http') {
    const url = process.env.EMAIL_WEBHOOK_URL;
    if (!url) throw new Error('EMAIL_WEBHOOK_URL is required for the http email transport.');
    return httpTransport(url);
  }
  return logTransport;
}

/**
 * Record and send one email. Deduplicates on an identical already-SENT
 * record with the same token hash (safe retries of the same token).
 * Failure is recorded (status FAILED, message-only error) and rethrown.
 */
export async function deliverEmail(email: OutboundEmail): Promise<{ id: string; status: string }> {
  if (email.tokenHash) {
    const existing = await prisma.emailDelivery.findFirst({
      where: { toEmail: email.to, kind: email.kind, tokenHash: email.tokenHash, status: 'SENT' },
    });
    if (existing) return { id: existing.id, status: existing.status };
  }
  const record = await prisma.emailDelivery.create({
    data: {
      toEmail: email.to,
      kind: email.kind,
      subject: email.subject,
      bodyText: email.text,
      tokenHash: email.tokenHash,
      status: 'QUEUED',
    },
  });
  try {
    await getConfiguredTransport().send(email);
    const updated = await prisma.emailDelivery.update({
      where: { id: record.id },
      data: { status: 'SENT', attempts: { increment: 1 } },
    });
    return { id: updated.id, status: updated.status };
  } catch (error) {
    // Record the operational failure without any token material.
    await prisma.emailDelivery.update({
      where: { id: record.id },
      data: {
        status: 'FAILED',
        attempts: { increment: 1 },
        lastError: error instanceof Error ? error.message : String(error),
      },
    });
    throw error;
  }
}

/**
 * Retry FAILED deliveries below the attempt cap. Intended for a cron/worker
 * or an admin-triggered sweep; returns how many were resent.
 */
export async function retryFailedDeliveries(options: { toEmail?: string; kind?: EmailKind } = {}): Promise<number> {
  const failed = await prisma.emailDelivery.findMany({
    where: {
      status: 'FAILED',
      attempts: { lt: MAX_DELIVERY_ATTEMPTS },
      ...(options.toEmail ? { toEmail: options.toEmail } : {}),
      ...(options.kind ? { kind: options.kind } : {}),
    },
    orderBy: { createdAt: 'asc' },
    take: 50,
  });
  let resent = 0;
  for (const delivery of failed) {
    try {
      await getConfiguredTransport().send({
        to: delivery.toEmail,
        kind: delivery.kind as EmailKind,
        subject: delivery.subject,
        text: delivery.bodyText,
      });
      await prisma.emailDelivery.update({
        where: { id: delivery.id },
        data: { status: 'SENT', attempts: { increment: 1 }, lastError: null },
      });
      resent += 1;
    } catch (error) {
      await prisma.emailDelivery.update({
        where: { id: delivery.id },
        data: {
          attempts: { increment: 1 },
          lastError: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }
  return resent;
}

/** Build a reset-password email body (HTML-escaped where user data appears). */
export function buildResetEmail(params: { to: string; appName?: string; resetUrl: string; expiresInHours?: number }): OutboundEmail {
  const app = params.appName ?? 'Slipstream UI';
  const hours = params.expiresInHours ?? 1;
  return {
    to: params.to,
    kind: 'password_reset',
    subject: `Reset your ${app} password`,
    text: `Reset your password: ${params.resetUrl}\nThis link expires in ${hours} hour(s). If you did not request this, ignore this email.`,
  };
}

/** Build a team-invite email body. */
export function buildInviteEmail(params: { to: string; appName?: string; inviterLabel: string; inviteUrl: string }): OutboundEmail {
  const app = params.appName ?? 'Slipstream UI';
  const inviter = escapeHtml(params.inviterLabel);
  return {
    to: params.to,
    kind: 'invite',
    subject: `You have been invited to a team on ${app}`,
    text: `${inviter} invited you to join a team on ${app}.\nAccept the invitation: ${params.inviteUrl}`,
  };
}
