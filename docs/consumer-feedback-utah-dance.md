# Consumer feedback: Utah Dance (0.8.0)

Date: 2026-11-13
Consumer: `d:/Projects/utah-dance` — a two-app Next.js 16 + Tailwind 4
monorepo (public site + admin) using `@slipstream-ui/core` and
`@slipstream-ui/themes` at 0.8.0 from the registry.

This report comes from a full design pass over the public site: the home
page, events/competitions, deadlines, directory, calendar, event detail,
org detail, styles, cities, about, brief, and submit. It records what worked,
what forced local reimplementation, and the API changes that would have kept
those patterns inside the library. Items are ordered by how much consumer code
they would remove.

## What worked well

- `Card`, `Button`, `Badge`, `Input`, `Select`, `Checkbox`, `Alert`, `Text`
  covered the form and surface layer without overrides. The `contrast` and
  `onDark` button variants are exactly what a full-bleed hero needs.
- `Pagination` in `pageHrefs` + `linkComponent` mode is the right shape for
  Server Components.
- `Accordion` (compound) owned ARIA, keyboard behavior, and animation for two
  different FAQ surfaces; only the `.faq-*` skin was local.
- `PageHeader` worked as soon as the lede was a string, and its `eyebrow` +
  `actions` slots match how these pages actually compose.
- `FormLayout` (`as="fieldset"`, `legend`, `description`) is the right
  grouping primitive for long forms.
- The 0.8.0 theme contract generated from `createTheme()` matched the brand
  and stayed AA in both modes.

## P1 — capability gaps that force local components

### 1. `PageHeader.description` should accept `ReactNode`

Today: `description?: string`. Eight of the twelve page headers on this site
have a link inside the lede ("browse the competitions page", "subscribe to the
ICS feed", "read the sourcing rules"). Those pages cannot use `PageHeader`, so
they keep a local `.page-header` block with the same eyebrow/title/lede shape.

Proposal:

```ts
description?: React.ReactNode; // keep `subtitle?: string` for compatibility
```

`SectionHeading.description` has the same constraint and the same use case.

### 2. `SegmentedControl` needs a link mode

Today it renders `<button>` segments and calls `onValueChange`. A list/grid
view switch must be a real URL so it survives a refresh, works without
JavaScript, and stays cacheable. The consumer either duplicates the markup
(local `.segmented` with `aria-current`) or ships a client boundary it does not
need.

Proposal, mirroring `Pagination` and `SiteFooter`:

```ts
type SegmentedOption = {
  value: string;
  label: React.ReactNode;
  href?: string;          // renders an anchor when present
  icon?: React.ReactNode;
  disabled?: boolean;
};

type SegmentedControlProps = {
  // ...existing
  linkComponent?: React.ElementType;
  linkHrefProp?: 'href' | 'to';
};
```

With `href`, each segment gets `aria-current="page"` when `value` matches, and
keyboard behavior falls back to normal link navigation.

### 3. `EmptyState` needs a left-aligned, panel variant

`EmptyState` is centered-only and uses `border-dashed border-border`. Content
pages with a filter bar need a left-aligned panel on a tinted surface, usually
with two or three text links instead of one button. Every consumer rebuilds
this (`empty-panel` here; `EmptyState.tsx` in the sibling dance app does the
same).

Proposal:

```ts
type EmptyStateProps = {
  align?: 'center' | 'start';      // default center
  tone?: 'plain' | 'panel';        // panel: tinted background + padding
  actions?: React.ReactNode;       // exists; accept inline text links
  titleAs?: 'p' | 'h2' | 'h3' | 'h4'; // exists
};
```

Also: `EmptyStateAction.href` renders a plain `<a>`. Add `linkComponent` (or
accept a node) so Next.js `Link` keeps client-side routing.

### 4. `StatBand` needs a data-dense variant

The marketing band is centered with large values. Data pages want a bordered
strip of hairline-separated cells with monospace numerals, uppercase labels,
and a third "note" line (`3 · published deadlines · closing soon`). This site
built `.stat-strip`; the sibling app built `.stat-*` too.

Proposal:

```ts
type StatBandProps = {
  variant?: 'plain' | 'panel';   // panel = bordered cells, 1px separators
  align?: 'center' | 'start';
  valueClassName?: string;       // host can apply mono / tabular numerals
  columns?: 2 | 3 | 4;           // exists
};
```

### 5. No cover/placeholder primitive for media

`Avatar` covers initials for people and firms. Media cards need a 16:9 cover
with a deterministic fallback when the entity has no image: a token-derived
gradient plus an optional mark, so a grid of imageless cards still looks
intentional and never reuses a generic social card.

Proposal: a `CoverImage` (or `Media`) component:

```ts
type CoverImageProps = {
  src?: string | null;
  alt: string;
  aspect?: 'video' | 'square' | 'wide' | string;
  seed?: string;                  // stable gradient selection
  priority?: boolean;
  fallback?: React.ReactNode;     // defaults to the seeded gradient
  sizes?: string;
};
```

This site implemented `EventCover` with a per-event-type gradient, ring motif,
and `data-type` hooks; the admin and the sibling app will reuse it.

### 6. No event/media card

A date chip, cover, type badge, registration/deadline state, and a details
affordance are the same five elements in every events directory. This repo
maintains `EventCard` and `MetroEventCard`; the sibling app maintains its own
`EventCard`; both re-derive date formatting and status labels.

Proposal: `MediaCard` or `EventCard` in a "commerce/content" group:

```ts
type EventCardProps = {
  href: string;
  title: string;
  startsOn: Date | string;
  endsOn?: Date | string | null;
  cover?: CoverImageProps;
  location?: string;
  chips?: Array<{ label: string; tone?: BadgeTone; dot?: boolean }>;
  meta?: React.ReactNode;        // e.g. "Registration closes Feb 26"
  footer?: React.ReactNode;
  layout?: 'row' | 'grid';
  linkComponent?: React.ElementType;
};
```

If a full event card is too domain-specific, a generic `MediaCard` plus the
`CoverImage` above still removes most of the duplication.

### 7. `EntityCard` links only the name

Directory cards need the whole card to be the link (one target, one hover
state, one focus ring) and a logo fallback. Today `EntityCard` links the name
and adds a footer link; the card body is not clickable.

Proposal:

```ts
cardHref?: string;         // makes the card one link (stretched-link pattern)
linkComponent?: React.ElementType; // exists
logo?: React.ReactNode;    // exists
loading?: boolean;         // skeleton for a directory query
```

### 8. Metadata chips

`Badge` is a fill with strong variants. A directory/list needs a quiet outline
chip with an optional status dot, and a wrapping group. This site built
`.chip` / `.chip--{soft,success,warn,danger,solid}` / `.chip-dot`.

Proposal: `Chip` (or `Badge variant="outline" + dot`):

```ts
type ChipProps = {
  tone?: 'neutral' | 'soft' | 'success' | 'warning' | 'danger';
  dot?: boolean;
  icon?: React.ReactNode;
  asChild?: boolean;
};
```

Add a `ChipGroup` with `wrap` and `gap` for tag rows.

### 9. Month *schedule* on top of the new `Calendar`

The in-progress `Calendar` (date picker) is the right foundation: ISO keys,
`today` override, keyboard moves, and month paging. It selects a day; an
events directory needs to *show events inside days*. Both dance apps build a
second month grid from scratch for this (`.cal-*` here).

Proposal: either add a render slot to `Calendar`:

```ts
renderDay?: (dateKey: string) => React.ReactNode; // events under the number
```

or ship a sibling `MonthSchedule` that reuses the same date utilities and cell
grid:

```ts
type MonthScheduleProps<T> = {
  month: string;                       // YYYY-MM
  events: T[];
  getDate: (event: T) => string;
  getLabel: (event: T) => string;
  getType?: (event: T) => string;
  getHref?: (event: T) => string;
  linkComponent?: React.ElementType;
  today?: string;
  maxPerDay?: number;
  legend?: Array<{ type: string; label: string }>;
  agendaBreakpoint?: 'sm' | 'md';
};
```

Keep `today` explicit (already true in `Calendar`) so server-rendered pages
never compute "today" from the server's UTC clock.

### 10. Result toolbar

Every filtered list needs: result count, page position, a view switch, a sort
select, and an optional "sorted by" note. This site built `.toolbar`.

Proposal: `ListToolbar` with `count`, `countLabel`, `children` (view switch /
sort), and `align`. It composes with `SegmentedControl` link mode and
`FiltersBar`.

## P2 — API polish

11. **`FormLayout` responsive columns.** `columns={2}` emits `grid-cols-2` with
    no breakpoint, so a consumer passes `className="grid-cols-1 sm:grid-cols-2"`
    and relies on class merging to undo the prop. Accept
    `columns={{ base: 1, md: 2 }}` (or `columns={2} responsive`) and keep the
    literal class map.

12. **Form section styling hooks.** `FormLayout` renders the legend as
    `text-sm font-medium` and the description as `text-xs text-muted-foreground`
    with no class hooks. Add `legendClassName` and `descriptionClassName` so
    hosts can apply their type scale without descendant selectors.

13. **Link-prop consistency.** `Pagination`, `SiteFooter`, and `EmptyState`
    each express "render a router link" differently:
    `pageHrefs` + `linkComponent`, `linkComponent` + `linkHrefProp`, and a raw
    `<a>`. Extract a shared `LinkLikeProps` type and apply it to every component
    that can render a destination (`EmptyState`, `EntityCard`, `ArticleCard`,
    `DealCard`, `Pagination`, `SiteFooter`, `Search` results).

14. **`PageHeader` heading level.** `PageHeader` always renders `h1`. A section
    header or a modal header cannot use it. Add `as?: 'h1' | 'h2'` (default
    `h1`) or document `SectionHeading` as the only alternative.

15. **`PageHeader` display scale.** The `size` scale tops out at
    `text-3xl`/`hero`; sites with a `clamp()` display scale must pass
    `titleClassName`. Either add a `display` size or document that
    `titleClassName` is expected for consumer type systems.

16. **`SiteFooter` contact slot.** The column model has no place for an
    address, email, or a contact line under the brand. Consumers keep a local
    footer for that block. Add `contact?: React.ReactNode` beside `tagline`.

17. **`Badge` as a link.** `<Badge asChild><Link/></Badge>` is used for city
    and style tags. If it is supported, document it in the manifest; if not,
    add `asChild` (this site had to remove two linked-badge usages).

18. **Consent.** There is a planned consent package (SLIP-079). Until it
    lands, every consumer writes its own cookie banner and consent store; both
    dance apps have one. Even a headless `useConsent()` + a styled banner slot
    would remove the duplication.

19. **Top utility strip.** `SiteHeader` starts at the brand row. A small
    utility bar (locale switch, feed link, submit link) is a common marketing
    need; SLIP-081 covers a v2, but a `topBar` slot would unblock consumers now.

20. **Docs: consumer recipes.** The component docs are exhaustive, but the
    patterns that consumers rebuild are not documented as recipes:
    - list/grid view switch on real URLs
    - result toolbar + empty results
    - media card with a generated cover
    - month calendar with agenda fallback
    - grouped long forms with `FormLayout`
    - filter panel that submits as a plain `<form>` (no client state)

    A single `/docs/recipes` route with these six examples, each validated
    against the manifests, would remove the most duplicated code across
    consumer apps.

## Notes from the integration

- The package's `validate_usage` MCP tool was not exercised in this pass; the
  consumer used `tsc` and ESLint over a Tailwind 4 + RSC app, and the 0.8.0
  types resolved cleanly.
- No runtime issues were found in `Accordion`, `Pagination`, or `PageHeader`
  when rendered from Server Components. The only server/client constraint hit
  was the expected one: callbacks (`onValueChange`) cannot cross the boundary,
  which is why the link modes above matter.
- Tailwind 4 scanning needed `@source "../../node_modules/@slipstream-ui/core/dist"`
  in the consumer's `globals.css`; the integration guide covers this, but a
  one-line note in the 0.8.0 changelog would help new consumers.
