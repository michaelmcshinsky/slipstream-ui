import type { Metadata } from 'next';
import Link from 'next/link';
import { CodeBlock } from '@slipstream-ui/ai';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/recipes', {
  title: 'Recipes',
  description:
    'Copy-paste patterns for the surfaces consumer apps rebuild most: URL-backed view switches, result toolbars, generated media covers, month schedules, long forms and no-JS filter panels.',
});

type Recipe = {
  id: string;
  title: string;
  description: string;
  components: string[];
  code: string;
};

const recipes: Recipe[] = [
  {
    id: 'view-switch-urls',
    title: 'List/grid view switch on real URLs',
    description:
      'A view toggle that survives refresh, works without JavaScript and stays cacheable: give each SegmentedControl option an href carrying the view param and let the router link component navigate. The active segment renders as an aria-current="page" marker instead of a button.',
    components: ['SegmentedControl'],
    code: `// Server component: read the view from searchParams, render links.
const view = searchParams.view === 'grid' ? 'grid' : 'list';

<SegmentedControl
  aria-label="View"
  value={view}
  options={[
    { value: 'list', label: 'List', href: '/events?view=list' },
    { value: 'grid', label: 'Grid', href: '/events?view=grid' },
  ]}
  linkComponent={Link}
/>

// In a client tree, swap Link for your router's link and keep
// onValueChange for instant swaps without a navigation.`,
  },
  {
    id: 'result-toolbar',
    title: 'Result toolbar + empty results',
    description:
      'The row every filtered list needs: result count, page position and a "sorted by" note on the left; a view switch and sort control on the right via children. Pair it with EmptyState tone="panel" when the filtered set is empty so the blank page still explains itself.',
    components: ['ListToolbar', 'SegmentedControl', 'Select', 'EmptyState'],
    code: `const count = events.length;

<ListToolbar
  count={count}
  countLabel="events"
  position={\`Page \${page} of \${pages}\`}
  note={sort ? \`Sorted by \${sort}\` : undefined}
>
  <SegmentedControl
    aria-label="View"
    value={view}
    options={[
      { value: 'list', label: 'List', href: \`?view=list&page=\${page}\` },
      { value: 'grid', label: 'Grid', href: \`?view=grid&page=\${page}\` },
    ]}
    linkComponent={Link}
  />
  <Select value={sort} onValueChange={setSort}>
    <option value="date">Date</option>
    <option value="name">Name</option>
  </Select>
</ListToolbar>

{count === 0 && (
  <EmptyState
    tone="panel"
    align="start"
    title="No events match those filters"
    description="Try widening the date range or clearing a filter."
    action={{ label: 'Clear filters', href: '/events' }}
  />
)}`,
  },
  {
    id: 'media-card-cover',
    title: 'Media card with a generated cover',
    description:
      'Entities without artwork still look intentional: pass a seed to CoverImage (via MediaCard cover) and the fallback is a deterministic token gradient picked from the seed — no image pipeline, no broken-image flash, and it tracks light/dark themes. Add a mark for monograms.',
    components: ['MediaCard', 'CoverImage'],
    code: `<MediaCard
  title={event.name}
  description={event.summary}
  meta={\`\${formatDate(event.date)} · \${event.city}\`}
  chips={[{ label: event.category, variant: 'outline-info', dot: true }]}
  footer="Details →"
  href={\`/events/\${event.slug}\`}
  linkComponent={Link}
  cover={{
    // src when the entity has art; otherwise a seeded gradient.
    src: event.imageUrl,
    alt: \`\${event.name} cover\`,
    aspect: 'video',
    seed: event.slug,
    mark: <EventIcon />,
  }}
/>`,
  },
  {
    id: 'month-schedule',
    title: 'Month calendar with agenda fallback',
    description:
      'MonthSchedule shows dated events inside day cells for desktop and swaps to a labelled per-day agenda below the breakpoint — both stay in the DOM, CSS picks per viewport. Accessors keep it domain-free: getDate/getLabel/getType/getHref map your records to cells, legend entries pin Badge tones to event types in order, and month paging is controlled (URL-synced) or uncontrolled.',
    components: ['MonthSchedule', 'Badge'],
    code: `const legend = [
  { type: 'performance', label: 'Performance' },
  { type: 'deadline', label: 'Deadline' },
];

<MonthSchedule
  events={events}
  getDate={(e) => e.date}
  getLabel={(e) => e.name}
  getType={(e) => e.kind}
  getHref={(e) => \`/events/\${e.slug}\`}
  legend={legend}
  maxPerDay={3}
  agendaBreakpoint="md"
  month={month}               // 'YYYY-MM'; controlled
  onMonthChange={setMonth}    // or defaultMonth for uncontrolled
  linkComponent={Link}
/>`,
  },
  {
    id: 'long-form-groups',
    title: 'Grouped long forms with FormLayout',
    description:
      'Long forms read better in labelled groups: FormLayout as="fieldset" renders a semantic fieldset with a legend and optional description, and columns accepts per-breakpoint counts so a two-column section collapses to one on mobile without className overrides.',
    components: ['FormLayout', 'Fieldset', 'FormField', 'Input'],
    code: `<Form method="post" action="/submit">
  <FormLayout as="fieldset" legend="Contact" description="How we reach you about this listing.">
    <FormField id="name" label="Name" required>
      <Input name="name" required />
    </FormField>
    <FormField id="email" label="Email" required>
      <Input name="email" type="email" required />
    </FormField>
  </FormLayout>

  <FormLayout
    as="fieldset"
    legend="Schedule"
    columns={{ base: 1, md: 2 }}
    legendClassName="text-base"
  >
    <FormField id="starts" label="Starts">
      <Input name="starts" type="date" />
    </FormField>
    <FormField id="ends" label="Ends">
      <Input name="ends" type="date" />
    </FormField>
  </FormLayout>
</Form>`,
  },
  {
    id: 'filter-panel-form',
    title: 'Filter panel that submits as a plain form',
    description:
      'FilterPanel is presentational: sections hold any content, including native named controls. Wrap it in a plain <form method="get">, give every control a name, and put a type="submit" button in the actions slot — the filtered URL works with no client state and no JavaScript at all.',
    components: ['FilterPanel', 'Button'],
    code: `<form method="get" action="/events">
  <FilterPanel
    title="Filters"
    collapsible
    defaultOpen={['Location']}
    sections={[
      {
        title: 'Location',
        content: (
          <select name="city" defaultValue={params.city ?? ''} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm">
            <option value="">Any city</option>
            <option value="salt-lake-city">Salt Lake City</option>
            <option value="provo">Provo</option>
          </select>
        ),
      },
      {
        title: 'When',
        content: (
          <input type="date" name="from" defaultValue={params.from} className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" />
        ),
      },
    ]}
    actions={
      <>
        <a href="/events" className="text-sm text-muted-foreground hover:text-foreground">Reset</a>
        <Button type="submit" size="sm">Apply</Button>
      </>
    }
  />
</form>

// The server reads searchParams.city / .from — no client state needed.`,
  },
];

const COMPONENT_LINKS: Record<string, string> = {
  SegmentedControl: '/docs/components/segmented-control',
  ListToolbar: '/docs/components/list-toolbar',
  Select: '/docs/components/select',
  EmptyState: '/docs/components/empty-state',
  MediaCard: '/docs/components/media-card',
  CoverImage: '/docs/components/cover-image',
  MonthSchedule: '/docs/components/month-schedule',
  Badge: '/docs/components/badge',
  FormLayout: '/docs/components/form-layout',
  Fieldset: '/docs/components/fieldset',
  FormField: '/docs/components/form-field',
  Input: '/docs/components/input',
  FilterPanel: '/docs/components/filter-panel',
  Button: '/docs/components/button',
};

export default function RecipesPage() {
  return (
    <div>
      <h1 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl">Recipes</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
        The patterns consumer apps rebuild most often, each validated against the component
        manifests. For AI chat surfaces see{' '}
        <Link href="/docs/patterns" className="font-medium text-primary underline underline-offset-2">
          Patterns
        </Link>
        ; for prop-level detail see the{' '}
        <Link href="/docs/components" className="font-medium text-primary underline underline-offset-2">
          component docs
        </Link>
        .
      </p>

      <div className="mt-10 space-y-14">
        {recipes.map((recipe) => (
          <section key={recipe.id} id={recipe.id} className="scroll-m-20">
            <h2 className="text-2xl font-semibold tracking-tight">{recipe.title}</h2>
            <p className="mt-2 max-w-3xl leading-relaxed text-muted-foreground">
              {recipe.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {recipe.components.map((name) =>
                COMPONENT_LINKS[name] ? (
                  <Link
                    key={name}
                    href={COMPONENT_LINKS[name]}
                    className="rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {name}
                  </Link>
                ) : (
                  <span
                    key={name}
                    className="rounded-full border border-border bg-muted px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
                  >
                    {name}
                  </span>
                )
              )}
            </div>
            <div className="mt-4">
              <CodeBlock language="tsx" code={recipe.code} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
