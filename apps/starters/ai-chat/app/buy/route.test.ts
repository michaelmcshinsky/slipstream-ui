import { afterEach, describe, expect, it } from 'vitest';
import { GET } from './route';

const original = process.env.NEXT_PUBLIC_CHECKOUT_URL;

afterEach(() => {
  if (original === undefined) delete process.env.NEXT_PUBLIC_CHECKOUT_URL;
  else process.env.NEXT_PUBLIC_CHECKOUT_URL = original;
});

describe('buy route', () => {
  it('returns 503 when checkout is not configured', async () => {
    delete process.env.NEXT_PUBLIC_CHECKOUT_URL;
    const response = await GET();
    expect(response.status).toBe(503);
    expect(await response.text()).toContain('NEXT_PUBLIC_CHECKOUT_URL');
  });

  it('redirects to the configured checkout URL', async () => {
    process.env.NEXT_PUBLIC_CHECKOUT_URL = 'https://example.com/checkout';
    const response = await GET();
    expect(response.status).toBe(303);
    expect(response.headers.get('location')).toBe('https://example.com/checkout');
  });
});
