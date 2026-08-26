export const dynamic = 'force-dynamic';

import { validateLicense } from '@/lib/licenses';
import { handle, readJson, badRequest } from '@/lib/api/handle';

/**
 * Public license validation endpoint used by the CLI and MCP server:
 *   POST { key, machineId }
 * Rate limiting happens at the edge in production.
 */
export async function POST(request: Request) {
  return handle(request, async () => {
    const body = await readJson<{ key?: string; machineId?: string }>(request);
    if (!body.key || !body.machineId) badRequest('key and machineId are required.');
    return validateLicense(body.key, body.machineId);
  });
}
