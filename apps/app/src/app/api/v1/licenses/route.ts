import { prisma } from '@slipstream-ui/db';
import { handle, parseQuery, paginationSchema, paginate, decodeCursor, json, withEtag } from '@/lib/api/core';
import { getPrincipal, requirePrincipal } from '@/lib/api/auth';

const querySchema = paginationSchema(20);

/** GET /api/v1/licenses — caller's license keys with activation counts. */
export async function GET(request: Request) {
  return handle(request, async () => {
    const principal = requirePrincipal(await getPrincipal(request));
    const query = parseQuery(request, querySchema);
    const cursorId = decodeCursor(query.cursor);

    const rows = await prisma.licenseKey.findMany({
      where: { ownerId: principal.user.id },
      include: { activations: { select: { machineId: true, lastSeenAt: true } } },
      orderBy: { id: 'asc' },
      ...(cursorId ? { cursor: { id: cursorId } } : {}),
      take: query.limit + 1,
    });

    const mapped = rows.map((license) => ({
      id: license.id,
      key: license.key,
      plan: license.plan,
      status: license.status,
      maxActivations: license.maxActivations,
      activations: license.activations.length,
    }));
    const { items, meta } = paginate(mapped, query.limit);
    return withEtag(request, json(items, { request, meta, cacheSeconds: 5 }));
  }, { routeName: 'v1.licenses', rateLimit: { limit: 120, windowMs: 60_000 } });
}
