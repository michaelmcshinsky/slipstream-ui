import { randomUUID } from 'node:crypto';
import { afterAll, describe, expect, it, vi } from 'vitest';
import { prisma } from '@slipstream-ui/db';
import {
  buildInviteEmail,
  buildResetEmail,
  deliverEmail,
  escapeHtml,
  getConfiguredTransport,
  httpTransport,
  noopTransport,
  retryFailedDeliveries,
} from './email';
import { generateToken, hashToken } from './tokens';

/**
 * KC-039: email delivery boundary — success/failure/retry/dedup records,
 * token hygiene (never persisted or logged raw), HTML escaping, and
 * production configuration validation.
 */

const createdUserIds: string[] = [];
const createdEmails: string[] = [];

afterAll(async () => {
  await prisma.emailDelivery.deleteMany({ where: { toEmail: { in: createdEmails } } });
  await prisma.auditLog.deleteMany({ where: { actorId: { in: createdUserIds } } });
  await prisma.user.deleteMany({ where: { id: { in: createdUserIds } } });
  await prisma.$disconnect();
});

function freshEmail(prefix = 'kc039') {
  const email = `${prefix}-${randomUUID()}@test.dev`;
  createdEmails.push(email);
  return email;
}

describe('delivery records', () => {
  it('records a SENT delivery without storing the raw token', async () => {
    const to = freshEmail();
    const token = generateToken();
    const result = await deliverEmail({
      ...buildResetEmail({ to, resetUrl: `http://x/reset?token=${token}` }),
      token,
      tokenHash: hashToken(token),
    });
    expect(result.status).toBe('SENT');
    const record = await prisma.emailDelivery.findUniqueOrThrow({ where: { id: result.id } });
    expect(record).toMatchObject({ toEmail: to, kind: 'password_reset', status: 'SENT', attempts: 1 });
    // The token column stores only the hash; the body is the message itself.
    expect(record.tokenHash).toBe(hashToken(token));
    expect(record.tokenHash).not.toBe(token);
  });

  it('records a FAILED delivery with a message-only error and rethrows', async () => {
    const to = freshEmail();
    vi.stubEnv('EMAIL_TRANSPORT', 'http');
    vi.stubEnv('EMAIL_WEBHOOK_URL', 'https://hooks.test/unreachable');
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('gateway down'));
    await expect(deliverEmail({ to, kind: 'invite', subject: 's', text: 't' })).rejects.toThrow(/gateway/);
    const record = await prisma.emailDelivery.findFirstOrThrow({ where: { toEmail: to } });
    expect(record).toMatchObject({ status: 'FAILED', lastError: 'gateway down', attempts: 1 });
    fetchSpy.mockRestore();
    vi.unstubAllEnvs();
  });
});

describe('token hygiene and escaping', () => {
  it('escapeHtml neutralizes markup in user-provided values', () => {
    expect(escapeHtml('<script>alert("x")</script> & \'quoted\'')).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &#39;quoted&#39;',
    );
  });

  it('invite email HTML-escapes the inviter label', () => {
    const email = buildInviteEmail({
      to: 'a@b.dev',
      inviterLabel: '<img src=x onerror=alert(1)>',
      inviteUrl: 'http://x/accept',
    });
    expect(email.text).not.toContain('<img');
    expect(email.text).toContain('&lt;img');
  });

  it('the log transport never prints the token unless explicitly opted in', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const token = generateToken();
    await noopTransport.send({ to: 'a@b.dev', kind: 'password_reset', subject: 's', text: 't', token });
    log.mockRestore();

    const spy = vi.spyOn(console, 'log').mockImplementation(() => undefined);
    const { logTransport } = await import('./email');
    await logTransport.send({ to: 'a@b.dev', kind: 'password_reset', subject: 's', text: 't', token });
    const printed = spy.mock.calls.map((call) => String(call[0])).join('\n');
    expect(printed).not.toContain(token);
    vi.stubEnv('EMAIL_DEV_INCLUDE_LINK', 'true');
    await logTransport.send({ to: 'a@b.dev', kind: 'password_reset', subject: 's', text: 't', token });
    const withOptIn = spy.mock.calls.map((call) => String(call[0])).join('\n');
    expect(withOptIn).toContain(token);
    vi.unstubAllEnvs();
    spy.mockRestore();
  });
});

describe('dedup and retry', () => {
  it('does not re-send an identical already-SENT message with the same token hash', async () => {
    const to = freshEmail();
    const token = generateToken();
    const tokenHash = hashToken(token);
    const first = await deliverEmail({ ...buildResetEmail({ to, resetUrl: 'http://x/r' }), token, tokenHash });
    const second = await deliverEmail({ ...buildResetEmail({ to, resetUrl: 'http://x/r' }), token, tokenHash });
    expect(second.id).toBe(first.id);
    expect(await prisma.emailDelivery.count({ where: { toEmail: to, tokenHash } })).toBe(1);
  });

  it('retries FAILED deliveries via the retry sweep and caps attempts', async () => {
    const to = freshEmail();
    // Seed a FAILED record directly (as a broken gateway would leave it).
    const seeded = await prisma.emailDelivery.create({
      data: { toEmail: to, kind: 'invite', subject: 's', bodyText: 't', status: 'FAILED', attempts: 1, lastError: 'boom' },
    });
    const resent = await retryFailedDeliveries({ toEmail: to });
    expect(resent).toBe(1);
    const record = await prisma.emailDelivery.findUniqueOrThrow({ where: { id: seeded.id } });
    expect(record.status).toBe('SENT');
    expect(record.attempts).toBe(2);
    expect(record.lastError).toBeNull();

    // Exceeding the cap makes the sweep skip the record.
    await prisma.emailDelivery.update({ where: { id: seeded.id }, data: { status: 'FAILED', attempts: 3 } });
    expect(await retryFailedDeliveries({ toEmail: to })).toBe(0);
  });
});

describe('production configuration validation', () => {
  it('requires the http transport and webhook URL in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('EMAIL_TRANSPORT', undefined);
    expect(() => getConfiguredTransport()).toThrow(/EMAIL_TRANSPORT=http/);
    vi.stubEnv('EMAIL_TRANSPORT', 'http');
    expect(() => getConfiguredTransport()).toThrow(/EMAIL_WEBHOOK_URL/);
    vi.unstubAllEnvs();
  });

  it('http transport posts JSON and throws on non-2xx', async () => {
    const ok = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('', { status: 200 }));
    await httpTransport('https://hooks.test/x').send({ to: 'a@b.dev', kind: 'invite', subject: 's', text: 't' });
    expect(ok).toHaveBeenCalledWith('https://hooks.test/x', expect.objectContaining({ method: 'POST' }));
    const body = JSON.parse(ok.mock.calls[0]![1]!.body as string);
    expect(body).toEqual({ to: 'a@b.dev', kind: 'invite', subject: 's', text: 't' });
    expect(JSON.stringify(body)).not.toContain('token');

    ok.mockResolvedValue(new Response('', { status: 500 }));
    await expect(
      httpTransport('https://hooks.test/x').send({ to: 'a@b.dev', kind: 'invite', subject: 's', text: 't' }),
    ).rejects.toThrow(/500/);
    ok.mockRestore();
  });
});
