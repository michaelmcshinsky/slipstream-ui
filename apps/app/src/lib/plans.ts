export const PLANS = [
  {
    id: 'FREE',
    name: 'Free',
    priceCents: 0,
    seats: 1,
    blurb: 'Everything open source. All core components.',
    features: ['All open-source components', 'Manifests + MCP server', 'Community support'],
  },
  {
    id: 'PRO',
    name: 'Pro',
    priceCents: 2900,
    seats: 1,
    blurb: 'License keys and activation management for individuals.',
    features: [
      'Everything in Free',
      'License key with 3 machine activations',
      'Self-service deactivation endpoint',
      // Label upcoming deliverables explicitly; never sell them as available (KC-044).
      'Premium templates & blocks (coming soon)',
      'Priority issue queue (coming soon)',
    ],
  },
  {
    id: 'TEAM',
    name: 'Team',
    priceCents: 9900,
    seats: 10,
    blurb: 'Shared licensing, team management, and high activation limits.',
    features: [
      'Everything in Pro',
      'Up to 10 seats',
      '100 activations per license',
      'Team billing & invoices',
    ],
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    priceCents: 49900,
    seats: 100,
    blurb: 'Licensing for large teams, with admin oversight.',
    features: [
      'Everything in Team',
      '100 seats',
      'Admin audit log console',
      // Label upcoming deliverables explicitly; never sell them as available (KC-044).
      'Audit log export (coming soon)',
      'SSO (coming soon)',
      'Support SLA & onboarding call (coming soon)',
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
