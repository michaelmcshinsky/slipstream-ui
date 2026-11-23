import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET, POST } from './route';

const SECRET = 'cron-test-secret';

function request(path: string, init: RequestInit = {}) {
  return new Request(`http://localhost${path}`, init);
}

function authorized(path: string, init: RequestInit = {}) {
  return request(path, {
    ...init,
    headers: { authorization: `Bearer ${SECRET}`, ...(init.headers ?? {}) },
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('newsletter cron auth', () => {
  it('rejects the legacy query-string secret', async () => {
    vi.stubEnv('NEWSLETTER_CRON_SECRET', SECRET);
    const response = await GET(request(`/api/cron/newsletter?frequency=daily&secret=${SECRET}`));
    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ error: { code: 'unauthorized' } });
  });

  it('rejects POST without a bearer token', async () => {
    vi.stubEnv('NEWSLETTER_CRON_SECRET', SECRET);
    const response = await POST(request('/api/cron/newsletter', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ frequency: 'daily' }),
    }));
    expect(response.status).toBe(401);
  });

  it('validates frequency after authentication', async () => {
    vi.stubEnv('NEWSLETTER_CRON_SECRET', SECRET);
    const response = await GET(authorized('/api/cron/newsletter?frequency=hourly'));
    expect(response.status).toBe(400);
    expect(await response.json()).toMatchObject({ error: { code: 'bad_request' } });
  });
});
