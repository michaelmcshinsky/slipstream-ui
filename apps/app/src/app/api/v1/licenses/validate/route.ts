import { z } from 'zod';
import { validateLicense } from '@/lib/licenses';
import { handle, parseBody } from '@/lib/api/core';

const bodySchema = z.object({
  key: z.string().min(8),
  machineId: z.string().min(3).max(128),
});

/**
 * POST /api/v1/licenses/validate — public endpoint used by the CLI/MCP.
 * Strict rate limit: 30/min per IP.
 */
export async function POST(request: Request) {
  return handle(request, async () => {
    const body = await parseBody(request, bodySchema);
    return validateLicense(body.key, body.machineId);
  }, { routeName: 'v1.licenses.validate', public: true, rateLimit: { limit: 30, windowMs: 60_000 } });
}
