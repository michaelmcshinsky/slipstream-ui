import { describe, expect, it, vi } from 'vitest';
import { createBillingController } from './billing-controller';

const teams = [
  { id: 'alpha', name: 'Alpha', slug: 'alpha', role: 'OWNER' },
  { id: 'beta', name: 'Beta', slug: 'beta', role: 'ADMIN' },
];
const plans = [
  { id: 'FREE', name: 'Free', priceCents: 0, blurb: 'Open source.', features: [] },
  { id: 'PRO', name: 'Pro', priceCents: 2900, blurb: 'Premium.', features: ['Templates'] },
  { id: 'TEAM', name: 'Team', priceCents: 9900, blurb: 'Shared.', features: [] },
];
const paid = { plan: 'PRO', status: 'ACTIVE', seats: 1, currentPeriodEnd: '2026-10-01T00:00:00.000Z' };
const checkoutUrl = '/api/billing/mock-confirm?checkoutId=opaque-token';
const success = (data: unknown) => Response.json({ data, meta: { requestId: 'test' } });
const failure = (message: string, status = 403) => Response.json({ error: { code: 'forbidden', message }, meta: { requestId: 'test' } }, { status });
const detail = (id = 'alpha', subscription: unknown = paid) => success({ team: { id, subscription } });

function deferred() {
  let resolve!: (value: Response) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<Response>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}

function fixture(teamList: unknown = teams) {
  const fetch = vi.fn<typeof globalThis.fetch>();
  fetch.mockResolvedValueOnce(success({ teams: teamList })).mockResolvedValueOnce(success({ plans })).mockResolvedValueOnce(detail());
  const navigate = vi.fn<(url: string) => void>();
  const reload = vi.fn<() => void>();
  const controller = createBillingController({ fetch, navigate, reload });
  return { controller, fetch, navigate, reload };
}

describe('billing dashboard controller', () => {
  it('unwraps teams, plans and subscription and defaults to the first team without unused requests', async () => {
    const { controller, fetch } = fixture();
    expect(controller.getSnapshot().loading).toBe(true);
    await controller.start(null);
    expect(controller.getSnapshot()).toMatchObject({ teams, plans, activeTeamId: 'alpha', subscription: paid, loading: false, loadingSubscription: false, error: null, canCheckout: true, canCancel: true });
    expect(fetch.mock.calls.map(([url]) => url)).toEqual(['/api/teams', '/api/billing/plans', '/api/teams/alpha']);
  });

  it('honors the URL team and validates team selection', async () => {
    const { controller, fetch } = fixture();
    fetch.mockReset().mockResolvedValueOnce(success({ teams })).mockResolvedValueOnce(success({ plans })).mockResolvedValueOnce(detail('beta'));
    await controller.start('beta');
    expect(controller.getSnapshot()).toMatchObject({ activeTeamId: 'beta', canCheckout: true, canCancel: false });
    await controller.selectTeam('foreign');
    expect(controller.getSnapshot()).toMatchObject({ activeTeamId: null, subscription: null, error: 'Selected team is not available.', canCheckout: false });
    expect(fetch).toHaveBeenCalledTimes(3);
  });

  it('does not silently switch an unavailable URL team to another team', async () => {
    const { controller, fetch } = fixture();
    await controller.start('foreign');
    expect(controller.getSnapshot()).toMatchObject({ activeTeamId: null, error: 'Selected team is not available.' });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('handles no teams without fetching a subscription or allowing mutations', async () => {
    const { controller, fetch } = fixture([]);
    await controller.start(null);
    await controller.checkout('PRO');
    await controller.cancel();
    expect(controller.getSnapshot()).toMatchObject({ teams: [], activeTeamId: null, subscription: null, error: null, loading: false, canCheckout: false, canCancel: false });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('treats an explicit null subscription as free, not a missing or malformed payload', async () => {
    const { controller, fetch } = fixture();
    await controller.start(null);
    fetch.mockResolvedValueOnce(detail('beta', null));
    await controller.selectTeam('beta');
    expect(controller.getSnapshot()).toMatchObject({ subscription: { plan: 'FREE', status: 'ACTIVE', seats: 1, currentPeriodEnd: null }, canCancel: false });
  });

  it.each([
    { response: () => success({ team: {} }), message: 'Invalid response from billing service.' },
    { response: () => success({ team: { id: 'beta' } }), message: 'Invalid response from billing service.' },
    { response: () => detail('wrong'), message: 'Invalid response from billing service.' },
    { response: () => detail('beta', { ...paid, seats: '1' }), message: 'Invalid response from billing service.' },
    { response: () => detail('beta', { ...paid, currentPeriodEnd: 'not-a-date' }), message: 'Invalid response from billing service.' },
    { response: () => success({ error: 'Team not found.' }), message: 'Team not found.' },
    { response: () => failure('Membership required.'), message: 'Membership required.' },
    { response: () => new Response('<html>Bad gateway</html>', { status: 502 }), message: 'Request failed (HTTP 502).' },
    { response: () => new Response('{'), message: 'Invalid response from billing service.' },
  ])('clears stale subscriptions and reports $message', async ({ response, message }) => {
    const { controller, fetch } = fixture();
    await controller.start(null);
    fetch.mockResolvedValueOnce(response());
    const loading = controller.selectTeam('beta');
    expect(controller.getSnapshot()).toMatchObject({ subscription: null, loadingSubscription: true, canCheckout: false });
    await loading;
    expect(controller.getSnapshot()).toMatchObject({ subscription: null, loadingSubscription: false, error: message, canCheckout: false });
  });

  it.each(['teams', 'plans'])('reports malformed %s envelopes instead of inventing defaults', async (endpoint) => {
    const { controller, fetch } = fixture();
    fetch.mockReset().mockResolvedValueOnce(endpoint === 'teams' ? Response.json({ teams }) : success({ teams }))
      .mockResolvedValueOnce(endpoint === 'plans' ? success({ plans: [{ ...plans[1], features: null }] }) : success({ plans }));
    await controller.start(null);
    expect(controller.getSnapshot()).toMatchObject({ error: 'Invalid response from billing service.', loading: false, canCheckout: false });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('surfaces initial network failures and permits an explicit retry', async () => {
    const { controller, fetch } = fixture();
    fetch.mockReset().mockRejectedValueOnce(new TypeError('offline')).mockResolvedValueOnce(success({ plans }));
    await controller.start(null);
    expect(controller.getSnapshot()).toMatchObject({ error: 'Unable to reach billing service. Please try again.', loading: false });
    fetch.mockResolvedValueOnce(success({ teams })).mockResolvedValueOnce(success({ plans })).mockResolvedValueOnce(detail());
    await controller.start(null);
    expect(controller.getSnapshot()).toMatchObject({ subscription: paid, error: null });
  });

  it.each(['success', 'failure'])('ignores stale subscription %s after switching teams', async (outcome) => {
    const { controller, fetch } = fixture();
    await controller.start(null);
    const old = deferred();
    fetch.mockReturnValueOnce(old.promise).mockResolvedValueOnce(detail('alpha', null));
    const previous = controller.selectTeam('beta');
    await controller.selectTeam('alpha');
    expect(fetch.mock.calls[3]?.[1]?.signal?.aborted).toBe(true);
    if (outcome === 'success') old.resolve(detail('beta'));
    else old.reject(new Error('old failure'));
    await previous;
    expect(controller.getSnapshot()).toMatchObject({ activeTeamId: 'alpha', subscription: { plan: 'FREE' }, error: null, loadingSubscription: false });
  });

  it('ignores stale initialization and supports cleanup followed by restart', async () => {
    const { controller, fetch } = fixture();
    const old = deferred();
    fetch.mockReset().mockReturnValueOnce(old.promise).mockResolvedValueOnce(success({ plans }));
    const previous = controller.start('beta');
    controller.dispose();
    fetch.mockResolvedValueOnce(success({ teams })).mockResolvedValueOnce(success({ plans })).mockResolvedValueOnce(detail());
    await controller.start(null);
    old.resolve(success({ teams }));
    await previous;
    expect(controller.getSnapshot()).toMatchObject({ activeTeamId: 'alpha', subscription: paid, error: null });
    expect(fetch).toHaveBeenCalledTimes(5);
  });

  it.each([
    { provider: 'mock', url: checkoutUrl },
    { provider: 'stripe', url: 'https://checkout.stripe.com/c/pay/session' },
  ])('unwraps $provider checkout without confirming payment and locks all submissions through navigation', async (result) => {
    const { controller, fetch, navigate } = fixture();
    await controller.start(null);
    const pending = deferred();
    fetch.mockReturnValueOnce(pending.promise);
    const checkout = controller.checkout('TEAM');
    await controller.checkout('PRO');
    await controller.cancel();
    expect(controller.getSnapshot()).toMatchObject({ pendingPlan: 'TEAM', canCheckout: false, canCancel: false });
    expect(fetch).toHaveBeenCalledTimes(4);
    expect(fetch.mock.calls[3]).toEqual(['/api/billing/checkout', expect.objectContaining({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ teamId: 'alpha', plan: 'TEAM' }) })]);
    pending.resolve(success(result));
    await checkout;
    expect(navigate).toHaveBeenCalledExactlyOnceWith(result.url);
    await controller.checkout('TEAM');
    expect(fetch).toHaveBeenCalledTimes(4);
  });

  it.each([
    { body: { url: checkoutUrl }, status: 200, message: 'Invalid response from billing service.' },
    { body: { data: { url: '', provider: 'stripe' } }, status: 200, message: 'Invalid response from billing service.' },
    { body: { data: { url: 'javascript:alert(1)', provider: 'mock' } }, status: 200, message: 'Invalid response from billing service.' },
    { body: { data: { url: '//foreign.test', provider: 'mock' } }, status: 200, message: 'Invalid response from billing service.' },
    { body: { data: { url: '/\\foreign.test', provider: 'mock' } }, status: 200, message: 'Invalid response from billing service.' },
    { body: { error: { code: 'forbidden', message: 'Admins only.' } }, status: 403, message: 'Admins only.' },
    { body: { error: { code: 'forbidden', message: 'Admins only.' } }, status: 200, message: 'Admins only.' },
    { body: { error: { message: { unsafe: true } } }, status: 500, message: 'Request failed (HTTP 500).' },
  ])('reports invalid/error checkout responses and unlocks for retry: $message', async ({ body, status, message }) => {
    const { controller, fetch, navigate } = fixture();
    await controller.start(null);
    fetch.mockResolvedValueOnce(Response.json(body, { status }));
    await controller.checkout('TEAM');
    expect(controller.getSnapshot()).toMatchObject({ error: message, pendingPlan: null, canCheckout: true });
    expect(navigate).not.toHaveBeenCalled();
  });

  it.each(['checkout', 'cancel'] as const)('catches %s network failures without unhandled rejections', async (action) => {
    const { controller, fetch, navigate, reload } = fixture();
    await controller.start(null);
    fetch.mockRejectedValueOnce(new TypeError('offline'));
    if (action === 'checkout') await controller.checkout('TEAM');
    else await controller.cancel();
    expect(controller.getSnapshot()).toMatchObject({ error: 'Unable to reach billing service. Please try again.', pendingPlan: null, canceling: false, canCheckout: true });
    expect(navigate).not.toHaveBeenCalled();
    expect(reload).not.toHaveBeenCalled();
  });

  it.each(['checkout', 'cancel'] as const)('does not navigate or reload for a stale %s result', async (action) => {
    const { controller, fetch, navigate, reload } = fixture();
    await controller.start(null);
    const pending = deferred();
    fetch.mockReturnValueOnce(pending.promise).mockResolvedValueOnce(detail('beta'));
    const mutation = action === 'checkout' ? controller.checkout('TEAM') : controller.cancel();
    await controller.selectTeam('beta');
    await controller.checkout('TEAM');
    expect(fetch).toHaveBeenCalledTimes(5);
    pending.resolve(success(action === 'checkout' ? { url: checkoutUrl, provider: 'mock' } : { ok: true }));
    await mutation;
    expect(navigate).not.toHaveBeenCalled();
    expect(reload).not.toHaveBeenCalled();
    expect(controller.getSnapshot()).toMatchObject({ activeTeamId: 'beta', pendingPlan: null, canceling: false, error: null, canCheckout: true });
  });

  it('unwraps cancellation and prevents duplicate cancellation or checkout before reload', async () => {
    const { controller, fetch, reload } = fixture();
    await controller.start(null);
    const pending = deferred();
    fetch.mockReturnValueOnce(pending.promise);
    const cancellation = controller.cancel();
    await controller.cancel();
    await controller.checkout('TEAM');
    expect(controller.getSnapshot().canceling).toBe(true);
    expect(fetch.mock.calls[3]).toEqual(['/api/billing/cancel', expect.objectContaining({ method: 'POST', body: JSON.stringify({ teamId: 'alpha' }) })]);
    pending.resolve(success({ ok: true }));
    await cancellation;
    expect(reload).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledTimes(4);
  });

  it.each([
    { response: () => success({ ok: false }), message: 'Invalid response from billing service.' },
    { response: () => Response.json({ ok: true }), message: 'Invalid response from billing service.' },
    { response: () => failure('Owners only.'), message: 'Owners only.' },
  ])('validates cancellation before reloading: $message', async ({ response, message }) => {
    const { controller, fetch, reload } = fixture();
    await controller.start(null);
    fetch.mockResolvedValueOnce(response());
    await controller.cancel();
    expect(controller.getSnapshot()).toMatchObject({ error: message, canceling: false, canCancel: true });
    expect(reload).not.toHaveBeenCalled();
  });

  it('enforces role and plan rules before sending mutations', async () => {
    const { controller, fetch } = fixture([{ ...teams[0], role: 'MEMBER' }]);
    await controller.start(null);
    await controller.checkout('TEAM');
    await controller.cancel();
    expect(controller.getSnapshot()).toMatchObject({ canCheckout: false, canCancel: false });
    expect(fetch).toHaveBeenCalledTimes(3);
    const owner = fixture();
    await owner.controller.start(null);
    await owner.controller.checkout('FREE');
    await owner.controller.checkout('UNKNOWN');
    await owner.controller.checkout('PRO');
    expect(owner.fetch).toHaveBeenCalledTimes(3);
  });

  it('notifies subscribers and prevents updates or redirects after disposal', async () => {
    const { controller, fetch, navigate } = fixture();
    const listener = vi.fn();
    const unsubscribe = controller.subscribe(listener);
    await controller.start(null);
    expect(listener).toHaveBeenCalled();
    const pending = deferred();
    fetch.mockReturnValueOnce(pending.promise);
    const checkout = controller.checkout('TEAM');
    unsubscribe();
    controller.dispose();
    const snapshot = controller.getSnapshot();
    listener.mockClear();
    pending.resolve(success({ url: checkoutUrl, provider: 'mock' }));
    await checkout;
    expect(controller.getSnapshot()).toBe(snapshot);
    expect(listener).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
  });
});
