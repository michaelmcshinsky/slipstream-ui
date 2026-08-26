export const PLANS = [
  {
    id: 'FREE',
    name: 'Free',
    priceCents: 0,
    seats: 1,
    blurb: 'Everything open source. All 21 core components.',
    features: ['All open-source components', 'Manifests + MCP server', 'Community support'],
  },
  {
    id: 'PRO',
    name: 'Pro',
    priceCents: 2900,
    seats: 1,
    blurb: 'Premium blocks, templates, and priority registry access.',
    features: [
      'Everything in Free',
      'Premium templates & blocks',
      'Private registry access (3 activations)',
      'Priority issue queue',
    ],
  },
  {
    id: 'TEAM',
    name: 'Team',
    priceCents: 9900,
    seats: 10,
    blurb: 'Shared license, team management, and unlimited activations.',
    features: [
      'Everything in Pro',
      'Up to 10 seats',
      'Unlimited license activations',
      'Team billing & invoices',
    ],
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    priceCents: 49900,
    seats: 100,
    blurb: 'SSO-ready licensing, audit exports, and support SLA.',
    features: [
      'Everything in Team',
      '100 seats',
      'Audit log export',
      'Support SLA & onboarding call',
    ],
  },
] as const;

export type PlanId = (typeof PLANS)[number]['id'];

export function getPlan(id: string) {
  return PLANS.find((plan) => plan.id === id);
}

export const ROLES = {
  membership: ['OWNER', 'ADMIN', 'MEMBER'] as const,
};

/** Role hierarchy for permission checks; higher number = more power. */
const ROLE_LEVEL: Record<string, number> = { MEMBER: 1, ADMIN: 2, OWNER: 3 };

export function hasAtLeast(memberRole: string, required: keyof typeof ROLE_LEVEL): boolean {
  return (ROLE_LEVEL[memberRole] ?? 0) >= ROLE_LEVEL[required];
}
