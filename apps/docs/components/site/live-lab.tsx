'use client';

import { Fragment, useState } from 'react';
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
import type { LabCopy } from '@/lib/marketing';

type RunStatus = 'success' | 'warning' | 'info';
type RunRow = { id: string; workflow: string; status: RunStatus; seats: number; owner: string };
type ViewMode = 'list' | 'board' | 'calendar';

/**
 * Renders a copy template such as `plan: {plan} · view: {view}` and keeps the
 * original emphasis: code-styled values and the highlighted step label.
 */
function Template({
  template,
  values,
  code = [],
  strong = [],
}: {
  template: string;
  values: Record<string, string | number>;
  code?: string[];
  strong?: string[];
}) {
  return (
    <>
      {template.split(/(\{\w+\})/).map((part, index) => {
        const match = /^\{(\w+)\}$/.exec(part);
        if (!match) return <Fragment key={index}>{part}</Fragment>;
        const key = match[1];
        const value = values[key] ?? part;
        if (code.includes(key)) {
          return (
            <code key={index} className="text-foreground">
              {value}
            </code>
          );
        }
        if (strong.includes(key)) {
          return (
            <span key={index} className="text-foreground">
              {value}
            </span>
          );
        }
        return <Fragment key={index}>{value}</Fragment>;
      })}
    </>
  );
}

const statusVariant: Record<RunStatus, 'success' | 'warning' | 'info'> = {
  success: 'success',
  warning: 'warning',
  info: 'info',
};

function runsFor(copy: LabCopy): RunRow[] {
  return [
    { id: 'run-1', workflow: copy.data.runs.onboardingEmails, status: 'success', seats: 42, owner: 'Ada' },
    { id: 'run-2', workflow: copy.data.runs.invoiceSync, status: 'warning', seats: 8, owner: 'Grace' },
    { id: 'run-3', workflow: copy.data.runs.churnScoring, status: 'info', seats: 21, owner: 'Alan' },
    { id: 'run-4', workflow: copy.data.runs.weeklyDigest, status: 'success', seats: 64, owner: 'Ada' },
    { id: 'run-5', workflow: copy.data.runs.leadEnrichment, status: 'success', seats: 12, owner: 'Martha' },
    { id: 'run-6', workflow: copy.data.runs.accessReview, status: 'warning', seats: 4, owner: 'Grace' },
  ];
}

function DataPane({ copy }: { copy: LabCopy }) {
  const runs = runsFor(copy);
  const [selected, setSelected] = useState<string[]>(['run-2']);

  const columns: DataTableColumn<RunRow>[] = [
    { key: 'workflow', header: copy.data.columns.workflow, sortable: true },
    {
      key: 'status',
      header: copy.data.columns.status,
      cell: (row) => (
        <Badge variant={statusVariant[row.status]}>{copy.data.statuses[row.status]}</Badge>
      ),
    },
    { key: 'owner', header: copy.data.columns.owner },
    { key: 'seats', header: copy.data.columns.seats, align: 'right', sortable: true },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          label={copy.data.activeRuns}
          value={runs.length}
          delta="+2"
          trend="up"
          hint={copy.data.thisWeek}
        />
        <MetricCard
          label={copy.data.selected}
          value={selected.length}
          hint={copy.data.useTheCheckboxes}
        />
        <MetricCard
          label={copy.data.successRate}
          value="98.2%"
          delta="+0.4"
          trend="up"
          hint={copy.data.vsLastWeek}
        />
      </div>
      <DataTable
        columns={columns}
        data={runs}
        rowId={(row) => row.id}
        caption={copy.data.caption}
        pageSize={4}
        selectedRowIds={selected}
        onSelectedRowIdsChange={setSelected}
        bulkActions={
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const template = selected.length === 1 ? copy.data.archivedOne : copy.data.archivedOther;
                toast.success(template.replace('{count}', String(selected.length)));
                setSelected([]);
              }}
            >
              {copy.data.archive}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected([])}>
              {copy.data.clear}
            </Button>
          </>
        }
      />
    </div>
  );
}

function FormsPane({ copy }: { copy: LabCopy }) {
  const [plan, setPlan] = useState('pro');
  const [view, setView] = useState<ViewMode>('board');
  const [site, setSite] = useState('slipstream-ui');

  const plans = [
    {
      value: 'free',
      label: copy.forms.plans.free.label,
      description: copy.forms.plans.free.description,
      group: copy.forms.planGroups.individual,
    },
    {
      value: 'pro',
      label: copy.forms.plans.pro.label,
      description: copy.forms.plans.pro.description,
      group: copy.forms.planGroups.individual,
    },
    {
      value: 'team',
      label: copy.forms.plans.team.label,
      description: copy.forms.plans.team.description,
      group: copy.forms.planGroups.business,
    },
  ];

  const views: ViewMode[] = ['list', 'board', 'calendar'];

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-4">
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            {copy.forms.selectMenuCaption}
          </p>
          <SelectMenu
            aria-label={copy.forms.planLabel}
            items={plans}
            value={plan}
            onValueChange={(next) => setPlan(next as string)}
          />
        </div>
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            {copy.forms.inputGroupCaption}
          </p>
          <InputGroup>
            <InputGroupAddon side="left" variant="muted">
              https://
            </InputGroupAddon>
            <Input
              aria-label={copy.forms.domainLabel}
              value={site}
              onChange={(event) => setSite(event.target.value)}
            />
            <InputGroupAddon side="right" variant="muted">
              .com
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">
            {copy.forms.buttonGroupCaption}
          </p>
          <ButtonGroup aria-label={copy.forms.viewModeLabel}>
            {views.map((mode) => (
              <Button
                key={mode}
                variant={view === mode ? 'default' : 'outline'}
                onClick={() => setView(mode)}
                aria-pressed={view === mode}
              >
                {copy.forms.views[mode]}
              </Button>
            ))}
          </ButtonGroup>
        </div>
        <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
          <Template
            template={copy.forms.summary}
            values={{ plan, view: copy.forms.views[view], domain: `https://${site || '…'}.com` }}
            code={['plan', 'view', 'domain']}
          />
        </div>
      </div>
    </div>
  );
}

function OverlaysPane({ copy }: { copy: LabCopy }) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [note, setNote] = useState('');

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
          {copy.overlays.deleteProject}
        </Button>
        <Button variant="outline" onClick={() => setDrawerOpen(true)}>
          {copy.overlays.openDrawer}
        </Button>
        <Button
          variant="outline-success"
          onClick={() => toast.success(copy.overlays.savedTitle, copy.overlays.savedBody)}
        >
          toast.success
        </Button>
        <Button
          variant="outline-warning"
          onClick={() => toast.warning(copy.overlays.rateLimitedTitle, copy.overlays.rateLimitedBody)}
        >
          toast.warning
        </Button>
        <Button
          variant="outline-info"
          onClick={() => toast.info(copy.overlays.headsUpTitle, copy.overlays.headsUpBody)}
        >
          toast.info
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">{copy.overlays.description}</p>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={copy.overlays.confirmTitle}
        description={copy.overlays.confirmDescription}
        destructive
        confirmLabel={copy.overlays.confirm}
        onConfirm={async () => {
          await new Promise((resolve) => setTimeout(resolve, 600));
          toast.success(copy.overlays.deleted);
        }}
      />

      <Drawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        title={copy.overlays.drawerTitle}
        description={copy.overlays.drawerDescription}
        side="right"
        size="sm"
        animate
      >
        <div className="space-y-3">
          <label className="block text-sm font-medium" htmlFor="lab-note">
            {copy.overlays.noteLabel}
          </label>
          <Input
            id="lab-note"
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={copy.overlays.notePlaceholder}
          />
          <Button
            onClick={() => {
              toast.success(copy.overlays.applied, note || copy.overlays.noNote);
              setDrawerOpen(false);
            }}
          >
            {copy.overlays.apply}
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

function FlowPane({ copy }: { copy: LabCopy }) {
  const [step, setStep] = useState(1);

  const steps = [
    copy.flow.steps.basics,
    copy.flow.steps.access,
    copy.flow.steps.billing,
    copy.flow.steps.review,
  ];

  return (
    <div className="space-y-5">
      <Stepper current={step} steps={steps} onStepClick={setStep} labels={copy.flow.states} />
      <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
        <Template
          template={copy.flow.summary}
          values={{ current: step + 1, total: steps.length, label: steps[step].label }}
          code={['current', 'total']}
          strong={['label']}
        />
        {steps[step].description
          ? copy.flow.descriptionSuffix.replace('{description}', steps[step].description as string)
          : ''}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          {copy.flow.back}
        </Button>
        <Button
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
        >
          {copy.flow.next}
        </Button>
      </div>
    </div>
  );
}

/**
 * Interactive lab on the marketing homepage. Everything here is built from
 * the shipped library — data table selection/pagination, metric cards,
 * SelectMenu/InputGroup/ButtonGroup, confirm + drawer + imperative toasts,
 * and the stepper. All copy comes from the active locale's marketing catalog.
 */
export function LiveLab({ copy }: { copy: LabCopy }) {
  return (
    <section className="border-b border-border">
      <div className="container mx-auto px-4 py-16">
        <SectionHeading
          eyebrow={copy.eyebrow}
          title={copy.title}
          description={copy.description}
          size="md"
        />
        <div className="mt-8 rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <Tabs defaultValue="data">
            <TabsList>
              <TabsTrigger value="data">{copy.tabs.data}</TabsTrigger>
              <TabsTrigger value="forms">{copy.tabs.forms}</TabsTrigger>
              <TabsTrigger value="overlays">{copy.tabs.overlays}</TabsTrigger>
              <TabsTrigger value="flow">{copy.tabs.flow}</TabsTrigger>
            </TabsList>
            <TabsContent value="data" className="pt-4">
              <DataPane copy={copy} />
            </TabsContent>
            <TabsContent value="forms" className="pt-4">
              <FormsPane copy={copy} />
            </TabsContent>
            <TabsContent value="overlays" className="pt-4">
              <OverlaysPane copy={copy} />
            </TabsContent>
            <TabsContent value="flow" className="pt-4">
              <FlowPane copy={copy} />
            </TabsContent>
          </Tabs>
        </div>
        <p className="mt-4 text-center text-sm text-muted-foreground">{copy.footer}</p>
      </div>
      <Toaster position="bottom-right" richColors />
    </section>
  );
}
