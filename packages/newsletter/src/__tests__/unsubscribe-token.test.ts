import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  newsletterUnsubscribeToken,
  newsletterUnsubscribeUrl,
  verifyNewsletterUnsubscribeToken,
} from '../lib/unsubscribe-token';

process.env.NEWSLETTER_UNSUBSCRIBE_SECRET = 'test-unsubscribe-secret';

describe('newsletter unsubscribe tokens', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('round-trips a valid token', () => {
    const token = newsletterUnsubscribeToken('user-1', 'daily');
    expect(verifyNewsletterUnsubscribeToken(token, 'daily')).toBe('user-1');
  });

  it('rejects a token for the wrong subscription type', () => {
    const token = newsletterUnsubscribeToken('user-1', 'daily');
    expect(verifyNewsletterUnsubscribeToken(token, 'weekly')).toBeNull();
  });

  it('rejects an expired token', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-01-01T00:00:00Z'));
    const token = newsletterUnsubscribeToken('user-1', 'weekly');
    vi.setSystemTime(new Date('2027-06-01T00:00:00Z'));
    expect(verifyNewsletterUnsubscribeToken(token, 'weekly')).toBeNull();
  });

  it('embeds the type and expiry in the signed payload', () => {
    const token = newsletterUnsubscribeToken('user-1', 'daily');
    const parts = token.split('.');
    expect(parts).toHaveLength(4);
    expect(parts[0]).toBe('user-1');
    expect(parts[1]).toBe('daily');
    expect(Number(parts[2])).toBeGreaterThan(Math.floor(Date.now() / 1000));
  });

  it('builds an unsubscribe URL carrying the signed token', () => {
    const url = newsletterUnsubscribeUrl('https://app.example.com/', 'user-1', 'daily');
    const parsed = new URL(url);
    expect(parsed.origin).toBe('https://app.example.com');
    const token = parsed.searchParams.get('token');
    expect(token).toBeTruthy();
    expect(verifyNewsletterUnsubscribeToken(token!, 'daily')).toBe('user-1');
  });
});
