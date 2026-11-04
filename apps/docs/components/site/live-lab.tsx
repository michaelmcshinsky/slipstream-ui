'use client';

import { useState } from 'react';
import {
  Badge,
  Button,
  ButtonGroup,
  ConfirmDialog,
  DataTable,
  Drawer,
  Input,
  InputGroup,
  InputGroupAddon,
  MetricCard,
  SectionHeading,
  SelectMenu,
  Stepper,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Toaster,
  toast,
  type DataTableColumn,
} from '@slipstream-ui/core';

type RunStatus = 'success' | 'warning' | 'info';
type RunRow = { id: string; workflow: string; status: RunStatus; seats: number; owner: string };

const RUNS: RunRow[] = [
  { id: 'run-1', workflow: 'Onboarding emails', status: 'success', seats: 42, owner: 'Ada' },
  { id: 'run-2', workflow: 'Invoice sync', status: 'warning', seats: 8, owner: 'Grace' },
  { id: 'run-3', workflow: 'Churn scoring', status: 'info', seats: 21, owner: 'Alan' },
  { id: 'run-4', workflow: 'Weekly digest', status: 'success', seats: 64, owner: 'Ada' },
  { id: 'run-5', workflow: 'Lead enrichment', status: 'success', seats: 12, owner: 'Martha' },
  { id: 'run-6', workflow: 'Access review', status: 'warning', seats: 4, owner: 'Grace' },
];

const statusVariant: Record<RunStatus, 'success' | 'warning' | 'info'> = {
  success: 'success',
  warning: 'warning',
  info: 'info',
};

const PLANS = [
  { value: 'free', label: 'Free', description: '1 project, community support', group: 'Individual' },
  { value: 'pro', label: 'Pro', description: 'Unlimited projects, priority support', group: 'Individual' },
  { value: 'team', label: 'Team', description: 'SSO, audit log, shared billing', group: 'Business' },
];

const FLOW_STEPS = [
  { label: 'Basics', description: 'Name and owner' },
  { label: 'Access', description: 'Roles and SSO' },
  { label: 'Billing', description: 'Plan and seats' },
  { label: 'Review' },
];

function DataPane() {
  const [selected, setSelected] = useState<string[]>(['run-2']);

  const columns: DataTableColumn<RunRow>[] = [
    { key: 'workflow', header: 'Workflow', sortable: true },
    {
      key: 'status',
      header: 'Status',
      cell: (row) => <Badge variant={statusVariant[row.status]}>{row.status}</Badge>,
    },
    { key: 'owner', header: 'Owner' },
    { key: 'seats', header: 'Seats', align: 'right', sortable: true },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard label="Active runs" value={RUNS.length} delta="+2" trend="up" hint="this week" />
        <MetricCard label="Selected" value={selected.length} hint="use the checkboxes" />
        <MetricCard label="Success rate" value="98.2%" delta="+0.4" trend="up" hint="vs last week" />
      </div>
      <DataTable
        columns={columns}
        data={RUNS}
        rowId={(row) => row.id}
        caption="Automation runs"
        pageSize={4}
        selectedRowIds={selected}
        onSelectedRowIdsChange={setSelected}
        bulkActions={
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                toast.success(`${selected.length} run${selected.length === 1 ? '' : 's'} archived`);
                setSelected([]);
              }}
            >
              Archive
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
              Clear
            </Button>
          </>
        }
      />
    </div>
  );
}

function FormsPane() {
  const [plan, setPlan] = useState('pro');
  const [view, setView] = useState<'list' | 'board' | 'calendar'>('board');
  const [site, setSite] = useState('slipstream-ui');

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-4">
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">SelectMenu — rich options, groups</p>
          <SelectMenu
            aria-label="Plan"
            items={PLANS}
            value={plan}
            onValueChange={(next) => setPlan(next as string)}
          />
        </div>
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">InputGroup — flush addons</p>
          <InputGroup>
            <InputGroupAddon side="left" variant="muted">
              https://
            </InputGroupAddon>
            <Input aria-label="Site domain" value={site} onChange={(event) => setSite(event.target.value)} />
            <InputGroupAddon side="right" variant="muted">
              .com
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">ButtonGroup — joined segments</p>
          <ButtonGroup aria-label="View mode">
            {(['list', 'board', 'calendar'] as const).map((mode) => (
              <Button
                key={mode}
                variant={view === mode ? 'default' : 'outline'}
                onClick={() => setView(mode)}
                aria-pressed={view === mode}
              >
                {mode[0].toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </ButtonGroup>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
          plan: <code className="text-foreground">{plan}</code> · view:{' '}
          <code className="text-foreground">{view}</code> · domain:{' '}
          <code className="text-foreground">
            https://{site || '…'}.com
          </code>
        </div>
      </div>
    </div>
  );
}

function OverlaysPane() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [note, setNote] = useState('');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
          Delete project…
        </Button>
        <Button variant="outline" onClick={() => setDrawerOpen(true)}>
          Open drawer
        </Button>
        <Button variant="outline-success" onClick={() => toast.success('Saved', 'Your changes are live')}>
          toast.success
        </Button>
        <Button variant="outline-warning" onClick={() => toast.warning('Rate limited', 'Retrying in 3s')}>
          toast.warning
        </Button>
        <Button variant="outline-info" onClick={() => toast.info('Heads up', 'New version available')}>
          toast.info
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">
        ConfirmDialog handles focus trap, Escape and an async pending state; toasts are imperative
        (<code className="text-foreground">toast.success()</code>) and stack above every overlay.
      </p>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete project?"
        description="This permanently removes the project and its runs. This cannot be undone."
        destructive
        confirmLabel="Delete"
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 600));
          toast.success('Project deleted');
        }}
      />

      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title="Filter runs"
        description="Drawer with a form, Escape and backdrop dismissal."
        side="right"
        size="sm"
        animate
      >
        <div className="space-y-3">
          <label className="block text-sm font-medium" htmlFor="lab-note">
            Note
          </label>
          <Input
            id="lab-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Only failed runs, last 24h…"
          />
          <Button
            onClick={() => {
              toast.success('Filter applied', note || 'No note added');
              setDrawerOpen(false);
            }}
          >
            Apply
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

function FlowPane() {
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-5">
      <Stepper current={step} steps={FLOW_STEPS} onStepClick={setStep} />
      <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        Step <code className="text-foreground">{step + 1}</code> of {FLOW_STEPS.length} —{' '}
        <span className="text-foreground">{FLOW_STEPS[step].label}</span>
        {FLOW_STEPS[step].description ? ` (${FLOW_STEPS[step].description})` : ''}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
          Back
        </Button>
        <Button
          onClick={() => setStep((s) => Math.min(FLOW_STEPS.length - 1, s + 1))}
          disabled={step === FLOW_STEPS.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

/**
 * Interactive lab on the marketing homepage. Everything here is built from
 * the shipped library — data table selection/pagination, metric cards,
 * SelectMenu/InputGroup/ButtonGroup, confirm + drawer + imperative toasts,
 * and the stepper.
 */
export function LiveLab() {
  return (
    <section className="border-b border-border">
      <div className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow="Live demo"
          title="The framework, running on this page"
          description="No screenshots. Every control below is a Slipstream component — selection, pagination, menus, overlays, toasts and wizards included."
          size="md"
        />
        <div className="mt-8 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <Tabs defaultValue="data">
            <TabsList>
              <TabsTrigger value="data">Data</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="overlays">Overlays</TabsTrigger>
              <TabsTrigger value="flow">Flow</TabsTrigger>
            </TabsList>
            <TabsContent value="data" className="pt-4">
              <DataPane />
            </TabsContent>
            <TabsContent value="forms" className="pt-4">
              <FormsPane />
            </TabsContent>
            <TabsContent value="overlays" className="pt-4">
              <OverlaysPane />
            </TabsContent>
            <TabsContent value="flow" className="pt-4">
              <FlowPane />
            </TabsContent>
          </Tabs>
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Every component ships a COMPONENT_MANIFEST, tests and a live docs page — this lab is the
          same library your agent queries over MCP.
        </p>
      </div>
      <Toaster position="bottom-right" richColors />
    </section>
  );
}
