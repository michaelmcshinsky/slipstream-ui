export const dynamic = 'force-dynamic';

import { validateLicense } from '@/lib/licenses';
import { handle, badRequest, z } from '@/lib/api/handle';
import { parseBody } from '@/lib/api/core';

/**
 * Public license validation endpoint used by the CLI and MCP server:
 *   POST { key, machineId }
 * Rate limiting happens at the edge in production.
 */
export async function POST(request: Request) {
  return handle(request, async () => {
    const body = await parseBody(
      request,
      z.object({ key: z.string().optional(), machineId: z.string().optional() }),
    );
    if (!body.key || !body.machineId) badRequest('key and machineId are required.');
    return validateLicense(body.key, body.machineId);
  });
}
