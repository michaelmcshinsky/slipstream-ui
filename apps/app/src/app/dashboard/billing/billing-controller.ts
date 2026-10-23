import { z } from 'zod';

const planIdSchema = z.enum(['FREE', 'PRO', 'TEAM', 'ENTERPRISE']);
const teamSchema = z.object({ id: z.string().min(1), name: z.string(), slug: z.string(), role: z.enum(['OWNER', 'ADMIN', 'MEMBER']) });
const planSchema = z.object({ id: planIdSchema, name: z.string().min(1), priceCents: z.number().int().nonnegative(), blurb: z.string(), features: z.array(z.string()) });
const subscriptionSchema = z.object({ plan: planIdSchema, status: z.string().min(1), seats: z.number().int().positive(), currentPeriodEnd: z.string().datetime().nullable() });

type BillingState = {
  teams: z.infer<typeof teamSchema>[];
  plans: z.infer<typeof planSchema>[];
  activeTeamId: string | null;
  subscription: z.infer<typeof subscriptionSchema> | null;
  loading: boolean;
  loadingSubscription: boolean;
  pendingPlan: string | null;
  canceling: boolean;
  error: string | null;
  canCheckout: boolean;
  canCancel: boolean;
};

type Dependencies = {
  fetch: typeof globalThis.fetch;
  navigate: (url: string) => void;
  reload: () => void;
};

const teamsSchema = z.object({ teams: z.array(teamSchema) });
const plansSchema = z.object({ plans: z.array(planSchema) });
const detailSchema = z.object({ team: z.object({ id: z.string(), subscription: subscriptionSchema.nullable() }) });
const errorSchema = z.object({ error: z.object({ code: z.string(), message: z.string().trim().min(1) }) });
const legacyErrorSchema = z.object({ data: z.object({ error: z.string().trim().min(1) }) });
const cancelSchema = z.object({ ok: z.literal(true) });
const checkoutSchema = z.object({
  provider: z.string().min(1),
  url: z.string().min(1).refine((value) => {
    if (value !== value.trim() || /[\\\s]/.test(value)) return false;
    if (value.startsWith('/') && !value.startsWith('//')) return true;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password;
    } catch {
      return false;
    }
  }),
});
const invalidResponse = 'Invalid response from billing service.';
const networkError = 'Unable to reach billing service. Please try again.';

export function createBillingController({ fetch, navigate, reload }: Dependencies) {
  let state: BillingState = {
    teams: [], plans: [], activeTeamId: null, subscription: null,
    loading: true, loadingSubscription: false, pendingPlan: null, canceling: false,
    error: null, canCheckout: false, canCancel: false,
  };
  const listeners = new Set<() => void>();
  let disposed = false;
  let generation = 0;
  let initialization: AbortController | undefined;
  let subscriptionRequest: AbortController | undefined;
  let submitting = false;

  function update(patch: Partial<BillingState>) {
    if (disposed) return;
    state = { ...state, ...patch };
    const role = state.teams.find((team) => team.id === state.activeTeamId)?.role;
    const ready = !state.loading && !state.loadingSubscription && !!state.subscription && !submitting;
    state.canCheckout = ready && (role === 'OWNER' || role === 'ADMIN');
    state.canCancel = ready && role === 'OWNER' && state.subscription?.plan !== 'FREE';
    listeners.forEach((listener) => listener());
  }

  async function request<T>(url: string, schema: z.ZodType<T>, options?: RequestInit): Promise<T> {
    let response: Response;
    try {
      response = await fetch(url, options);
    } catch {
      throw new Error(networkError);
    }
    let raw: unknown;
    try {
      raw = await response.json();
    } catch {
      throw new Error(response.ok ? invalidResponse : `Request failed (HTTP ${response.status}).`);
    }
    const error = errorSchema.safeParse(raw);
    if (error.success) throw new Error(error.data.error.message);
    if (!response.ok) throw new Error(`Request failed (HTTP ${response.status}).`);
    const legacyError = legacyErrorSchema.safeParse(raw);
    if (legacyError.success) throw new Error(legacyError.data.data.error);
    const envelope = z.object({ data: z.unknown(), error: z.never().optional() }).safeParse(raw);
    if (!envelope.success) throw new Error(invalidResponse);
    const parsed = schema.safeParse(envelope.data.data);
    if (!parsed.success) throw new Error(invalidResponse);
    return parsed.data;
  }

  function message(error: unknown) {
    return error instanceof Error ? error.message : 'Billing operation failed. Please try again.';
  }

  async function selectTeam(teamId: string | null) {
    if (disposed || state.loading) return;
    const current = ++generation;
    subscriptionRequest?.abort();
    const team = state.teams.find((entry) => entry.id === teamId);
    update({ activeTeamId: team?.id ?? null, subscription: null, loadingSubscription: !!team, error: teamId !== null && !team ? 'Selected team is not available.' : null });
    if (!team) return;
    subscriptionRequest = new AbortController();
    try {
      const data = await request(`/api/teams/${encodeURIComponent(team.id)}`, detailSchema, { signal: subscriptionRequest.signal });
      if (disposed || generation !== current) return;
      if (data.team.id !== team.id) throw new Error(invalidResponse);
      update({ subscription: data.team.subscription ?? { plan: 'FREE', status: 'ACTIVE', seats: 1, currentPeriodEnd: null } });
    } catch (error) {
      if (generation === current) update({ error: message(error) });
    } finally {
      if (generation === current) update({ loadingSubscription: false });
    }
  }

  async function start(teamId: string | null) {
    disposed = false;
    const current = ++generation;
    initialization?.abort();
    subscriptionRequest?.abort();
    initialization = new AbortController();
    update({ teams: [], plans: [], activeTeamId: null, subscription: null, loading: true, loadingSubscription: false, error: null });
    try {
      const [teamData, planData] = await Promise.all([
        request('/api/teams', teamsSchema, { signal: initialization.signal }),
        request('/api/billing/plans', plansSchema, { signal: initialization.signal }),
      ]);
      if (disposed || generation !== current) return;
      update({ teams: teamData.teams, plans: planData.plans, loading: false });
      await selectTeam(teamId ?? teamData.teams[0]?.id ?? null);
    } catch (error) {
      if (generation === current) update({ loading: false, error: message(error) });
    }
  }

  async function mutate(plan: string | null) {
    if (disposed || submitting || !state.activeTeamId) return;
    if (plan === null ? !state.canCancel : !state.canCheckout) return;
    if (plan !== null && (plan === 'FREE' || plan === state.subscription?.plan || !state.plans.some((entry) => entry.id === plan))) return;
    const current = generation;
    const teamId = state.activeTeamId;
    submitting = true;
    update({ error: null, pendingPlan: plan, canceling: plan === null });
    let leaving = false;
    const options: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan === null ? { teamId } : { teamId, plan }),
    };
    try {
      if (plan === null) {
        await request('/api/billing/cancel', cancelSchema, options);
        if (disposed || generation !== current) return;
        reload();
      } else {
        const result = await request('/api/billing/checkout', checkoutSchema, options);
        if (disposed || generation !== current) return;
        navigate(result.url);
      }
      leaving = true;
    } catch (error) {
      if (generation === current) update({ error: message(error) });
    } finally {
      if (!leaving) {
        submitting = false;
        update({ pendingPlan: null, canceling: false });
      }
    }
  }

  return {
    getSnapshot: () => state,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    start,
    selectTeam,
    checkout: (plan: string) => mutate(plan),
    cancel: () => mutate(null),
    dispose: () => {
      disposed = true;
      generation++;
      initialization?.abort();
      subscriptionRequest?.abort();
    },
  };
}
