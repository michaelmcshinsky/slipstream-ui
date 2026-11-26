import { afterEach, describe, expect, it, vi } from 'vitest';
import { prisma } from '@slipstream-ui/db';
import { GET, POST } from './route';

const SECRET = 'cron-test-secret';

function authorized(path: string, init: RequestInit = {}) {
  return new Request(`http://localhost${path}`, {
    ...init,
    headers: { authorization: `Bearer ${SECRET}`, ...(init.headers ?? {}) },
  });
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('metrics cron auth', () => {
  it('rejects requests without the cron secret', async () => {
    vi.stubEnv('CRON_SECRET', SECRET);
    const response = await GET(new Request('http://localhost/api/cron/metrics'));
    expect(response.status).toBe(401);
  });

  it('rejects a wrong bearer token', async () => {
    vi.stubEnv('CRON_SECRET', SECRET);
    const response = await POST(
      new Request('http://localhost/api/cron/metrics', {
        method: 'POST',
        headers: { authorization: 'Bearer wrong' },
      }),
    );
    expect(response.status).toBe(401);
  });
});

describe('metrics snapshot', () => {
  it('upserts one snapshot per UTC day and is idempotent', async () => {
    vi.stubEnv('CRON_SECRET', SECRET);
    const day = new Date().toISOString().slice(0, 10);
    await prisma.metricSnapshot.deleteMany({ where: { day } });

    const first = await GET(authorized('/api/cron/metrics'));
    expect(first.status).toBe(200);
    const body = await first.json();
    expect(body.data).toMatchObject({ success: true, day });

    const second = await POST(authorized('/api/cron/metrics', { method: 'POST' }));
    expect(second.status).toBe(200);

    const rows = await prisma.metricSnapshot.findMany({ where: { day } });
    expect(rows).toHaveLength(1);
    const metrics = JSON.parse(rows[0].metrics) as { billing?: { mrr?: number } };
    expect(typeof metrics.billing?.mrr).toBe('number');
  });
});
