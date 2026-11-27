# @slipstream-ui/core

## 0.11.10

### Patch Changes

- [#222](https://github.com/michaelmcshinsky/slipstream-ui/pull/222) [`3d362a7`](https://github.com/michaelmcshinsky/slipstream-ui/commit/3d362a7c7a4db2a1eebd71b20a857d0038e421b1) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add `MediaCard` — media card for event, article and listing grids with a CoverImage cover, metadata line, status chips and a whole-card link.

- [#224](https://github.com/michaelmcshinsky/slipstream-ui/pull/224) [`9df3271`](https://github.com/michaelmcshinsky/slipstream-ui/commit/9df32718445e5fa37306ae5f9b5e1a0ca4bc5967) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add `MonthSchedule` — a month grid that renders dated events inside each day, with a type legend, "+N more" overflow, and an agenda list below a breakpoint.

## 0.11.9

### Patch Changes

- [#213](https://github.com/michaelmcshinsky/slipstream-ui/pull/213) [`70ec84c`](https://github.com/michaelmcshinsky/slipstream-ui/commit/70ec84cf77c665ba03ba652ce59ac519e9945112) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add `xs` size to `Button` (`h-8 px-2.5 text-xs`) for dense toolbars, table rows and compact headers where `sm` (`h-9`) is still too tall.

- [#218](https://github.com/michaelmcshinsky/slipstream-ui/pull/218) [`07645cf`](https://github.com/michaelmcshinsky/slipstream-ui/commit/07645cf6d2f13a979daa6b6a283a9f3c83400172) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - `DataTable` gains `cardLayout`: a responsive fallback that renders each row as a definition-list card (column headers become field labels) below a breakpoint — `true` switches below `md` (768px), or pass `'sm' | 'md' | 'lg' | 'xl' | '2xl'` to choose. Both layouts render and swap via CSS only, so sorting, selection, pagination, and row callbacks behave identically in each; the table is `display:none` below the breakpoint so assistive tech sees one layout at a time.

- [#215](https://github.com/michaelmcshinsky/slipstream-ui/pull/215) [`f605629`](https://github.com/michaelmcshinsky/slipstream-ui/commit/f605629d850bb0d3f3ee805f0b376b180445e722) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add `ListToolbar`: a slim result bar for filtered lists and directories with a result count, optional page position and "sorted by" note on the left, and slots for a `SegmentedControl` view switch and sort control on the right. The summary line is `aria-live="polite"`.

- [#214](https://github.com/michaelmcshinsky/slipstream-ui/pull/214) [`726396e`](https://github.com/michaelmcshinsky/slipstream-ui/commit/726396e10906cbb7a6cf1039302f9c426acc55ed) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - `SegmentedControl` `fullWidth` now accepts a breakpoint (`'sm' | 'md' | 'lg' | 'xl' | '2xl'`) in addition to `boolean`: the string form fills the container below that breakpoint and hugs content at and above it, covering the responsive "full-width on mobile, compact on desktop" case without a wrapper element.

- [#216](https://github.com/michaelmcshinsky/slipstream-ui/pull/216) [`20cd611`](https://github.com/michaelmcshinsky/slipstream-ui/commit/20cd611931a574444124249a8bb854d7eba8c789) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - `SegmentedOption` gains an optional `hint` string: rendered as a small muted marker after the label and exposed via `aria-description`, so supplementary notes (e.g. "no Pro-Am ladder published") stay visible without changing the segment's accessible name.

## 0.11.8

### Patch Changes

- [#210](https://github.com/michaelmcshinsky/slipstream-ui/pull/210) [`37403bf`](https://github.com/michaelmcshinsky/slipstream-ui/commit/37403bfe1f13c27ca56f4483f4c9362d3bbc121a) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add `as` (`'h1' | 'h2'`, default `'h1'`) to `PageHeader` for section-level and embedded headers, and a `contact` ReactNode slot to `SiteFooter` under the tagline for address/email/phone blocks.

## 0.11.7

### Patch Changes

- [#207](https://github.com/michaelmcshinsky/slipstream-ui/pull/207) [`31ee8fb`](https://github.com/michaelmcshinsky/slipstream-ui/commit/31ee8fb13e59f188fa6f05dedba6aad0b50c69d2) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add `mobileMenuOpenLabel`, `mobileMenuCloseLabel`, and `mobileDrawerCloseLabel` props to `SiteHeader` so the mobile trigger and drawer close button can be localized; defaults unchanged.

## 0.11.6

### Patch Changes

- [#203](https://github.com/michaelmcshinsky/slipstream-ui/pull/203) [`20e4720`](https://github.com/michaelmcshinsky/slipstream-ui/commit/20e47204022ab056d65c9c13a8a8e8fd23fbfd55) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Reset the WebKit search cancel button on `input[type="search"]` in the prebuilt `styles.css` so search inputs match other fields on iOS/Safari.

## 0.11.5

### Patch Changes

- [#204](https://github.com/michaelmcshinsky/slipstream-ui/pull/204) [`e375919`](https://github.com/michaelmcshinsky/slipstream-ui/commit/e375919e056ad8ba5516b7254a08c7abdd23ba0e) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - New `CoverImage` component: fixed-aspect media cover that renders the image when present and a deterministic seed-derived token gradient (with optional mark) when the entity has no art — imageless grids stay intentional. `Image` gains a `sizes` prop.

- [#193](https://github.com/michaelmcshinsky/slipstream-ui/pull/193) [`3a6b77e`](https://github.com/michaelmcshinsky/slipstream-ui/commit/3a6b77e509bf0b7085a1116f7ed1650f82a6a2c0) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - EmptyState gains `align="start"` and `tone="panel"` for left-aligned tinted empty panels on content pages, plus `linkComponent`/`linkHrefProp` so action hrefs keep client-side routing. Defaults are unchanged.

- [#191](https://github.com/michaelmcshinsky/slipstream-ui/pull/191) [`a9ab041`](https://github.com/michaelmcshinsky/slipstream-ui/commit/a9ab0413e529b472a3c1925d8d76c1957d044502) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - SegmentedControl link mode: options accept `href` to render real links for URL-backed view switches (refresh-safe, no-JS, cacheable). Active segment becomes a non-link `aria-current="page"` marker; `linkComponent`/`linkHrefProp` support client-side routers. Button mode is unchanged.

- [#201](https://github.com/michaelmcshinsky/slipstream-ui/pull/201) [`f602dd7`](https://github.com/michaelmcshinsky/slipstream-ui/commit/f602dd7c535659733eb4662747a1ea432f139ff0) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - StatBand gains `variant="panel"` — a bordered strip of hairline-separated cells with denser type, uppercase labels and mobile row separators for data pages — plus `valueClassName` for mono/tabular numerals. `plain` remains the default marketing band.

## 0.11.4

### Patch Changes

- [#187](https://github.com/michaelmcshinsky/slipstream-ui/pull/187) [`319ef36`](https://github.com/michaelmcshinsky/slipstream-ui/commit/319ef36bc630d1bfff15fbd70f7ca8407d3a0dee) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - `FormLayout` gains responsive grids and fieldset styling hooks: `columns` now accepts per-breakpoint counts (`{ base: 1, md: 2 }`) so consumers stop undoing `grid-cols-2` via className, and `legendClassName`/`descriptionClassName` expose the legend and description styling. Implements consumer feedback from utah-dance.

## 0.11.3

### Patch Changes

- [#185](https://github.com/michaelmcshinsky/slipstream-ui/pull/185) [`af940f6`](https://github.com/michaelmcshinsky/slipstream-ui/commit/af940f6571bbef422b9d0185b5f793581fb07071) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - `Badge` gains quiet status surfaces and a status dot for metadata chips: new `outline-success`/`outline-warning`/`outline-info`/`outline-danger` variants (tinted border + ink text, subtle tint on hover) and a `dot` prop that renders a leading dot colored to the variant. Works with `asChild` via Radix `Slottable`. Implements consumer feedback from utah-dance.

## 0.11.2

### Patch Changes

- [#183](https://github.com/michaelmcshinsky/slipstream-ui/pull/183) [`e6539d3`](https://github.com/michaelmcshinsky/slipstream-ui/commit/e6539d377fae830583c60696f035589b2f64aa1c) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add `cardHref` to `EntityCard`: opt-in stretched-link mode that makes the whole card a single link target (one hover state, one focus ring), suppresses the redundant footer "View profile" link, and keeps `actions` clickable above the overlay. Implements consumer feedback from utah-dance.

## 0.11.1

### Patch Changes

- [#179](https://github.com/michaelmcshinsky/slipstream-ui/pull/179) [`525982e`](https://github.com/michaelmcshinsky/slipstream-ui/commit/525982e8067df1e3299ed2cd4f7892b6bb1a5f61) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - `PageHeader` `description`/`subtitle` and `SectionHeading` `description` now accept `ReactNode` instead of only `string`, so ledes can contain links and inline markup without consumers re-implementing the heading block (consumer feedback: utah-dance).

## 0.11.0

### Minor Changes

- [#175](https://github.com/michaelmcshinsky/slipstream-ui/pull/175) [`b5d06c4`](https://github.com/michaelmcshinsky/slipstream-ui/commit/b5d06c45b304776cc1fbf99fb41a8cc7744903f4) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - - Menu: implement first-letter typeahead (focus next item matching the typed character, cycling).
  - ProcessSteps: new `headingLevel` prop (h2-h4, default h3) so step titles continue the page outline without skipping ranks.
  - LogoCloud: new `linkHrefProp` ('href' | 'to') for react-router style link components, matching LinkTabs/SiteFooter/Pagination.

### Patch Changes

- [#175](https://github.com/michaelmcshinsky/slipstream-ui/pull/175) [`8a40cf6`](https://github.com/michaelmcshinsky/slipstream-ui/commit/8a40cf67a8aa2ffc6d66cf7d3688bfd1fd76e9f7) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - LoadMore: use a typographic ellipsis in the default `loadingLabel` ("Loading…") for consistency with the rest of the library.

## 0.10.2

### Patch Changes

- [#151](https://github.com/michaelmcshinsky/slipstream-ui/pull/151) [`77dab16`](https://github.com/michaelmcshinsky/slipstream-ui/commit/77dab16cd861b2afcbf4b8f3d7f729eb7f63668f) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Fix four component defects: `DatePickerPopover` now forwards `aria-describedby`/`aria-invalid` to its trigger so `FormField` hint/error wiring reaches assistive tech; `Image` restarts its `src -> fallbackSrc -> fallback` chain when the URLs change instead of sticking on a stale fallback; `FileUpload` keys and removes entries by File identity so same-named files stay distinct; `FilterPanel` identifies sections by index so duplicate titles no longer collide on open state or DOM ids.

- [#151](https://github.com/michaelmcshinsky/slipstream-ui/pull/151) [`1f949b1`](https://github.com/michaelmcshinsky/slipstream-ui/commit/1f949b1bc530e2d2baf74b782c3893c05cb126a7) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Fix `List size="compact"` actually reducing row density, replace the `Reasoning` collapse toggle's literal `?` glyph with a chevron, and make disabled `RadioGroupItem` labels dim via `peer-disabled`.

- [#151](https://github.com/michaelmcshinsky/slipstream-ui/pull/151) [`55600a3`](https://github.com/michaelmcshinsky/slipstream-ui/commit/55600a3146bf2f151848be4e78e792f559945ba3) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Correct the `Menu` JSDoc: it advertised typeahead, but `MenuContent` only implements arrow/Home/End/Escape navigation.

## 0.10.1

### Patch Changes

- [`a51dbc4`](https://github.com/michaelmcshinsky/slipstream-ui/commit/a51dbc4b72a870bdea9c8ae59c2a604deffcf424) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Use `text-primary-ink` for text and icon roles on light surfaces and `bg-primary/10` tints so links, eyebrows, active states, and chips clear WCAG AA contrast; the Tailwind v3 preset now maps `primary.ink` so the utility generates for v3 consumers.

## 0.10.0

### Minor Changes

- [#146](https://github.com/michaelmcshinsky/slipstream-ui/pull/146) [`ad40d9d`](https://github.com/michaelmcshinsky/slipstream-ui/commit/ad40d9d66d092506d0cf89e9d788f0c272bd885b) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - feat: form-control contrast, overlay polish and density options
  
  Light-mode fixes
  
  - `createTheme()` now records `colorScheme` and `themeToCssVariables()` emits
    `color-scheme`, so native chrome (scrollbars, checkboxes, radios, the date
    picker panel) follows the theme instead of a dark OS preference. The docs
    theme pins `color-scheme: light` on `:root` for the same reason.
  - `Checkbox` and `Radio` set `accent-primary`, so the checked fill is the brand
    colour instead of the UA accent.
  - `RangeSlider` gives the thumb a primary fill with a background-coloured ring
    and a `md` shadow, and the unfilled rail uses `border` instead of `muted`, so
    the control reads on a white page.
  
  New props
  
  - `Tooltip` gains `variant: 'default' | 'inverse'` — the inverse surface is
    navy in light mode and white in dark mode.
  - `Select` gains `labelHidden` for filter bars and toolbars: the label stays the
    accessible name but no longer pushes the control out of alignment.
  - `FilterChips` gains `size: 'sm' | 'md' | 'lg'`.
  - `Message` gains `density` and `surface`; `Conversation` gains `density` and
    `messageSurface`; `PromptInput` gains `density` and `surface`. Together they
    cover tighter chat layouts and borderless or tinted bubbles.
  - `StreamingIndicator` gains `size`, `tone`, `dotCount` and `showLabel`.
  
  Visual fixes
  
  - `Timeline` draws one connector rail per item that starts at the dot's bottom
    edge and runs into the next dot; the flex-column connector left a gap at each
    item boundary.
  - `Drawer` paints the backdrop (`bg-background/80`) and fades it with the panel,
    so page content no longer flashes through during close.
  - `Accordion` keeps the panel mounted through a 300ms grid-row and opacity
    transition, so collapse animates instead of disappearing on the closing
    frame.

## 0.9.0

### Minor Changes

- [#121](https://github.com/michaelmcshinsky/slipstream-ui/pull/121) [`f1d340c`](https://github.com/michaelmcshinsky/slipstream-ui/commit/f1d340c960e93c452a59dbe63a53ca35102c4fae) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - feat(i18n): localize the marketing lab, chat demo and docs shell
  
  `Stepper` accepts `labels` (`completed`, `current`, `upcoming`) so the
  screen-reader state suffix is no longer English-only. `DataTable` accepts
  `selectedLabel` (`{count} selected` by default) for the selection summary
  above the table. `Conversation` accepts `userLabel`, `assistantLabel` and
  `labels` (`transcript`, `responseComplete`, `loadEarlier`, `loadingEarlier`,
  `latest`, `download`) and forwards the role labels to each `Message`.
  
  The docs shell gained a `site.translation` message group used by the
  "this page is English only for now" notice, and `LocaleSwitcher` now uses
  logical padding and inset so the caret stays on the trailing side in RTL.

- [#124](https://github.com/michaelmcshinsky/slipstream-ui/pull/124) [`afdab6f`](https://github.com/michaelmcshinsky/slipstream-ui/commit/afdab6f40000cae6e9771185c8cf528cad3fbbf1) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - feat(core): add Image, nested SiteHeader menus, and a primary ink token
  
  `Image` fills the last media gap in the library: `src` → `fallbackSrc` →
  `fallback` node, intrinsic `width`/`height` on every render, `decoding="async"`,
  and `priority` for the single LCP image. It is manifested with the fallback and
  alt-text rules.
  
  `SiteHeader` accepts nested `columns` on an item. Desktop renders a disclosure
  trigger with `aria-expanded`/`aria-controls`, opens on hover or click, stays
  open while tabbing, and closes on Escape or an outside pointer. The mobile
  drawer renders the same groups as native `<details>` disclosures.
  
  `primary-ink` joins the theme contract: a darker primary for text roles on
  light surfaces and `primary/10` tints, and the lightened primary in dark mode.
  `Link`, the Sidebar active item, `PageHeader`/`SectionHeading` eyebrows,
  `ArticleCard`/`CTASection` eyebrows, and the highlighted `ComparisonTable`
  column now use it. `bg-primary` is unchanged for fills.
  
  The dark-mode \destructive\ text token is lightened slightly so it clears 4.5:1 on the popover surface; the previous value missed by 0.002.

- [#110](https://github.com/michaelmcshinsky/slipstream-ui/pull/110) [`ef31109`](https://github.com/michaelmcshinsky/slipstream-ui/commit/ef311099c8603e6e791aa8b13b7c2b8caae33b1e) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - feat(core): Popover placement and a Calendar date grid
  
  `PopoverContent` gained `side`, `align`, `sideOffset`, `alignOffset`,
  `collisionPadding` and `matchTriggerWidth`, plus a `PopoverAnchor` element. The
  panel now flips to the opposite side when the preferred one cannot fit, clamps
  inside the viewport, and repositions on scroll instead of closing.
  
  Note: the old panel right-aligned to the trigger; the default is now
  `align="start"`, which left-aligns. Consumers that relied on the previous
  right edge can pass `align="end"`.
  
  New `Calendar` renders a six-week month grid with ISO `YYYY-MM-DD` values,
  min/max, `isDateDisabled`, locale-aware labels, week start, and keyboard
  navigation (arrows, Home/End, PageUp/PageDown, Enter) with a single roving tab
  stop. `DatePickerPopover` composes `Popover` + `Calendar` for a themed date
  field that still posts an ISO value through a hidden input.

### Patch Changes

- [#121](https://github.com/michaelmcshinsky/slipstream-ui/pull/121) [`f1d340c`](https://github.com/michaelmcshinsky/slipstream-ui/commit/f1d340c960e93c452a59dbe63a53ca35102c4fae) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - fix(a11y): dark-mode contrast and naming findings from the full audit
  
  - Calendar outside-month days move from `text-muted-foreground/50` (2.94:1 on
    the dark background) to `/80` (5.1:1).
  - Dark `destructive` lifts from 64% to 65% lightness: 4.47:1 → 4.64:1 as text
    on the popover surface.
  - The docs search button's accessible name now matches its rendered text, and
    the shortcut hint uses the same string as the label.

- [#116](https://github.com/michaelmcshinsky/slipstream-ui/pull/116) [`acdd742`](https://github.com/michaelmcshinsky/slipstream-ui/commit/acdd7424d7943c439a64bfe6959cb4a8b6a4aca3) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - fix(core): restore focus and measurement on the popover, and keyboard focus in Calendar
  
  - `PopoverContent` returns focus to the trigger on Escape; previously focus fell to
    `<body>` and a keyboard user lost their place.
  - The dialog's `aria-labelledby` now reads the rendered trigger, so a trigger with an
    explicit `id` no longer produces a dangling reference, and an anchor-only panel emits
    no `aria-labelledby` at all.
  - A popover that starts open (controlled `open`) measures once the anchor ref is
    attached. On first mount the panel previously stayed `visibility: hidden` forever.
  - `Calendar` moves DOM focus with its roving tab stop when a keyboard user tabs in and
    navigates without `autoFocus`; only the `tabIndex` used to move before.
  - `addDays` and `startOfWeek` return an unparseable key unchanged instead of computing
    from 1970-01-01.

- [#110](https://github.com/michaelmcshinsky/slipstream-ui/pull/110) [`ef31109`](https://github.com/michaelmcshinsky/slipstream-ui/commit/ef311099c8603e6e791aa8b13b7c2b8caae33b1e) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - fix(a11y): add a success ink token for text on success tints
  
  `text-success` on `bg-success/10` measured 4.11:1 in light mode, under the
  4.5:1 minimum for small text. `success-ink` joins `warning-ink` and `info-ink`:
  5.6:1 on a 10% tint in light mode and 7.9:1 on the dark card.
  
  The ToolCall `completed` chip, the Confirmation `approved` chip and the Alert
  `success` variant now use `text-success-ink`. A themes test pins both values and
  fails if the plain `success` token ever starts passing on a tint (which would
  mean the token contract changed).

## 0.8.0

### Minor Changes

- [#107](https://github.com/michaelmcshinsky/slipstream-ui/pull/107) [`5a229c1`](https://github.com/michaelmcshinsky/slipstream-ui/commit/5a229c132991dd4ae565e0f4106f4066f961e017) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Resizable `Drawer` for wide detail panes.
  
  `Drawer` accepts `resizable` on left and right drawers. The inner edge becomes a focusable `separator` handle: drag it, or use Arrow keys (16px), Shift+Arrow (64px) and Home/End (bounds). `minWidth` (240), `maxWidth` (960) and `defaultWidth` bound the width, and `onWidthChange` fires when a resize commits so the width can be persisted. `resizeLabel` names the handle for assistive tech.
  
  Top and bottom drawers ignore `resizable`, since their extent is controlled by `height`.

- [#103](https://github.com/michaelmcshinsky/slipstream-ui/pull/103) [`ab21033`](https://github.com/michaelmcshinsky/slipstream-ui/commit/ab21033e7bf72b9e54126c9b653f0d7e8cfee1a1) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Roadmap 0.8-0.9: migration aliases, the remaining prop gaps and a mobile bottom tab bar.
  
  **Migration aliases** (canonical prop wins when both forms are passed):
  
  - `PageHeader` accepts `subtitle` as an alias for `description`.
  - `MetricCard` accepts `title` and `description` as aliases for `label` and `hint`; `label` is now optional when `title` is passed.
  - `AuthLayout` accepts `subtitle` and `logo` as aliases for `description` and `brand`.
  - `Drawer` accepts `onClose` as a close-request alias for `onOpenChange(false)`; `onOpenChange` is now optional when `onClose` is passed.
  
  **New props:**
  
  - `EmptyState.action` accepts `{ label, onClick?, href?, variant? }` and renders the Button (or an anchor styled as one) for you. Rendered nodes still work.
  - `Accordion.items` takes `{ id, title, content, disabled? }[]` and renders one section per entry instead of `children`.
  - `AuthLayout.maxWidth` overrides the card width with pixels or any CSS width.
  - `Badge.size` adds `sm` / `md` / `lg` to every variant.
  - `MetricCard.tone` colors the value (`success` / `warning` / `destructive`); `MetricCard.loading` renders an `aria-busy` skeleton.
  
  **New component:**
  
  - `BottomNav` — mobile bottom tab bar for 3-5 primary destinations: `aria-current="page"` on the active tab, count badges, disabled tabs, a router `linkComponent`, 44px minimum targets and safe-area padding.
  
  Every addition ships a `COMPONENT_MANIFEST` entry, docs page rows, tests and regenerated registry/LLM output.

## 0.7.0

### Minor Changes

- [#84](https://github.com/michaelmcshinsky/slipstream-ui/pull/84) [`db0e184`](https://github.com/michaelmcshinsky/slipstream-ui/commit/db0e184ce7e2534013368c9a95f71fb8c6aecea6) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add the marketplace card layer: `DealCard`, `EntityCard` (with `ProfileCard`
  alias), `TombstoneCard`, `DocumentCard` and `LoadMore`.
  
  Deal access is stated with text badges; document downloads are disabled unless
  the document is available; unavailable items keep their reason and status;
  LoadMore announces loading and end-of-list states.

### Patch Changes

- [#84](https://github.com/michaelmcshinsky/slipstream-ui/pull/84) [`db0e184`](https://github.com/michaelmcshinsky/slipstream-ui/commit/db0e184ce7e2534013368c9a95f71fb8c6aecea6) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Fix WCAG 2.2 issues found by the dark-mode audit.
  
  - `Separator` only exposes `aria-orientation` when it has the `separator` role.
  - `Tabs` only emits `aria-controls` when the referenced panel is rendered.
  - `Timeline` muted items keep token colors instead of dimming with opacity.
  - `RangeSlider` inputs and `DatePicker`/`DateRangePicker`/`TimePicker` clear
    buttons meet the 24px target-size minimum.
  - `SelectMenu` exposes the select-only `combobox` role on its trigger and makes
    the scrollable listbox focusable, so the open state is valid ARIA.

## 0.6.1

### Patch Changes

- Fix the modal-layer effect cleanup so it captures the current layer id, and
  allow Tailwind CSS v4 as a peer alongside v3.4 because the package ships the
  v4 theme contract.

## 0.6.0

### Minor Changes

- [`352e873`](https://github.com/michaelmcshinsky/slipstream-ui/commit/352e87336f87bd5f2ab5fc327d204af6f62a8944) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add the dashboard filter layer: `MultiSelect`, `FilterPanel`,
  `DateRangePicker` and `AppliedFilters`.
  
  `MultiSelect` pairs a searchable checkbox panel with removable chips outside
  the trigger. `FilterPanel` owns collapsible sections and reset/apply actions
  without owning filter values. `DateRangePicker` uses an ISO string contract and
  keeps the end on or after the start. `AppliedFilters` wraps `FilterChips` with
  a live count and an edit action.

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`9dfc268`](https://github.com/michaelmcshinsky/slipstream-ui/commit/9dfc2688503324e7f8dda0784643b688d5ce47b9) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add prebuilt stylesheets (`styles.css`, `styles-full.css`, `themes/styles.css`), support `data-theme="dark"` alongside `.dark`, make form controls compatible with native change handlers and react-hook-form, and add `LinkTabs` and `ThemeToggle`.

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`876be12`](https://github.com/michaelmcshinsky/slipstream-ui/commit/876be124dd63ac553e83465a1130eed3a1c9ba6d) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add a tone-aware marketing and data-filter layer.
  
  - `Container` and `Section` with width, vertical rhythm and `tone` presets.
    `Section` scopes inverse surface tokens so cards, borders and muted text
    stay readable inside a contrasting band.
  - `Hero`, `StatBand`, `CTASection` and `ComparisonTable` marketing blocks.
  - `SegmentedControl`, `RangeSlider` and `FilterChips` for dashboards and
    filter-heavy list pages.
  - Themes gain `inverse`, `inverse-foreground`, `inverse-muted`,
    `inverse-border`, `inverse-card`, `inverse-primary` and related tokens, plus
    matching Tailwind v3 and v4 mappings. Inverse sections keep AA contrast in
    both light and dark mode.

- [`feaf8c6`](https://github.com/michaelmcshinsky/slipstream-ui/commit/feaf8c62252d54bc1d4a2fad5ecb4215a113011b) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add the second marketing block batch: `LogoCloud`, `FeatureGrid`, `FeatureRow`,
  `Testimonial`, `ProcessSteps`, `ArticleCard`, `Newsletter`, `ContactStrip` and
  `AnnouncementBar`. Each ships a manifest, tests, docs and registry payload.
  
  `Newsletter` owns email capture state and success/error feedback but not the
  CRM transport. `ArticleCard` accepts a router `linkComponent`. `AnnouncementBar`
  owns dismissal only; persistence stays with the caller.

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`1e8e062`](https://github.com/michaelmcshinsky/slipstream-ui/commit/1e8e062cabae7b0fbe8b9e13de9556ba553e8b38) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add `linkHrefProp` so router-bound components work with react-router's `to`
  prop, `brandLabel` and `mobileActions` on SiteHeader, and `activeHref` /
  `match` on SiteFooter. Fix the mobile menu button icon and expanded state,
  wire the CLI to prebuilt and Tailwind 4 stylesheets (including `src/styles.css`
  targets), and correct the install docs.

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`876be12`](https://github.com/michaelmcshinsky/slipstream-ui/commit/876be124dd63ac553e83465a1130eed3a1c9ba6d) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add integration escape hatches and fix the registry install path.
  
  - Core: emit per-file ESM/CJS modules and component subpath exports
    (`@slipstream-ui/core/card`) that preserve each file's `use client`
    directive. The root import remains a client bundle for compatibility.
  - SectionHeading, PageHeader: `titleClassName`, `descriptionClassName` and
    `eyebrowClassName` for host display typography.
  - Hero: `titleClassName`, `descriptionClassName`, `eyebrowClassName` and
    `badgeClassName`.
  - SiteHeader: `showMobileTrigger`, `desktopBreakpoint` and `navClassName` so
    hosts can keep their own mobile navigation and header height.
  - TableOfContents: `ariaLabel` and `labelClassName`; active links are
    underlined.
  - Breadcrumb: `truncateCurrent` for long current-page labels.
  - Select: native `<option>` children in addition to `options`/`groups`.
  - CLI `add`: copy the component's relative dependency closure and
    `components/slipstream/utils/`, rewrite support imports, and skip existing
    files unless `--overwrite`.
  - CLI `diff` and `add`: read `componentsDir` from `slipstream.config.json`
    and reject paths outside the project.
  - CLI `diff`: normalize support imports and line endings before comparing, so
    a copied install does not report false drift.
  - Dialog and Drawer: share a modal layer stack for body scroll lock and
    nested Escape handling.
  - CLI `init`: extend an existing CSS-variable theme with only the missing
    Slipstream tokens instead of skipping stylesheet setup.
  - Themes: publish the Tailwind CSS 3 preset at
    `@slipstream-ui/themes/tailwind-preset`.
  - Tailwind 3 preset: map timing keys as `standard`, `in`, and `out` so
    `ease-standard` compiles. The previous `ease-*` keys generated
    `ease-ease-*` and never produced the utility.
  - Registry payloads stamp the package version instead of stale
    per-component versions.
  - Docs: use `npx @slipstream-ui/cli@latest`, and document the new add/init
    behaviour and the Tailwind preset.

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`7dca271`](https://github.com/michaelmcshinsky/slipstream-ui/commit/7dca2714066c74e461da4fb04262540f52e6714b) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add `contrast`/`onDark` button variants and link-mode pagination (`pageHrefs`,
  `linkComponent`, `linkHrefProp`) for Server Components. Invalidate the manifest
  registry cache when manifest files change so a running MCP server sees edits
  without a restart.

### Patch Changes

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`a0b5723`](https://github.com/michaelmcshinsky/slipstream-ui/commit/a0b5723495cb31df3f814521aa34198ae359a23c) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Fix the AppShell desktop rail so it stays viewport-height and keeps its footer visible, keep Sidebar parent items active on nested routes, and expose accessible `navLabel` / `mobileNavLabel` props on SiteHeader.

- [`6945e41`](https://github.com/michaelmcshinsky/slipstream-ui/commit/6945e4131dedc792a6e2cf512a9f4cdc1d0d3658) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Localize the remaining P1 component labels with optional props and English
  defaults: Autocomplete clear/suggestions, Breadcrumb landmark, DatePicker and
  TimePicker clear, FileUpload selected/remove/uploading, Search list label,
  CommandPalette dialog/list/empty, Toaster dismiss, Skeleton opt-in status
  label, and AppShell mobile-navigation labels. Message and Reasoning now accept
  `formatTime` or a BCP-47 `locale` for timestamps, and the AI Chat Starter
  passes the active locale. The i18n package gains an `en-XA` pseudo-locale
  catalog and providers accept `pseudo`, with a persisted playground toggle.

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`876be12`](https://github.com/michaelmcshinsky/slipstream-ui/commit/876be124dd63ac553e83465a1130eed3a1c9ba6d) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Fix pagination typography and harden the Tailwind v4 verification fixture.
  
  - Pagination now renders an ellipsis glyph, en-dash range summaries and
    `«` / `»` boundary glyphs, matching the documented summary and tests.
  - `verify:tailwind-v4` runs the installed `@tailwindcss/cli` binary directly
    instead of calling `npx --no-install @tailwindcss/cli`, which fails on
    Windows. The fixture also verifies the new inverse selectors.

- [`9b07d2e`](https://github.com/michaelmcshinsky/slipstream-ui/commit/9b07d2e5a87623e8f3a9f9033364e711a9285212) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Radio accepts the native `onChange` handler again, matching Checkbox and Select. Both `onChange` and `onCheckedChange` fire, so react-hook-form `register()` and plain native handlers work without a Controller.

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`5a8d403`](https://github.com/michaelmcshinsky/slipstream-ui/commit/5a8d403af48c4e6705f17a3d91227f35187920eb) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Select now fills its container like Input, and native `<option>`/`<optgroup>` children are a documented fallback: `groups` wins over `options`, and `options` wins over `children`. This lets react-hook-form `register()` spread and dynamic option lists work without converting to the `options` array.

- [#68](https://github.com/michaelmcshinsky/slipstream-ui/pull/68) [`876be12`](https://github.com/michaelmcshinsky/slipstream-ui/commit/876be124dd63ac553e83465a1130eed3a1c9ba6d) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Integration fixes surfaced by adopting Slipstream in a Next.js App Router site: `Badge` gains `neutral` and `accent` variants and now renders an inline `span`, `Alert` accepts `danger` as an alias of `destructive`, `EmptyState` accepts an `actions` alias and a `titleAs` heading level, `Textarea` stops narrowing native `value`/`onChange` so react-hook-form and other native form libraries type-check, the `add` command resolves peer dependencies from the correct manifest and drops two unused bindings, and the Tailwind v4 docs point at the prebuilt `@slipstream-ui/themes/styles.css` defaults.

## 0.5.0

### Minor Changes

- [`768bac2`](https://github.com/michaelmcshinsky/slipstream-ui/commit/768bac237c0f83fffdb114322a68805fdb00539a) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Migration-readiness pass 2: the gaps surfaced by re-auditing dancestack,
  floorpass and the two profile sites against the current library.

  Variants and aliases (P0 for floorpass):

  - Badge gains success/warning/info/primary/danger (primary and danger are
    aliases for default/destructive)
  - Button gains primary/danger aliases and a loading state (spinner,
    disabled, aria-busy, sr-only announcement)

  New components:

  - Link: default/muted/underline/arrow/external variants, asChild for
    router links, auto external detection (target=\_blank + rel=noopener
    noreferrer + sr-only note; mailto/tel never new-tab)
  - SectionHeading: eyebrow/title/description/actions with level 2-4,
    left/center alignment and sm/md/lg sizes

  App shell (P0 for dancestack):

  - SidebarItem.children for nested groups (aria-expanded/aria-controls,
    auto-opens the group containing the active route)
  - collapsible rail: collapsed/defaultCollapsed/onCollapsedChange,
    defaultExpanded groups; AppShell shrinks the aside to w-16 via
    :has([data-collapsed]) and gains mobileBreakpoint

  DataTable (P1 for dancestack):

  - Row selection: selectedRowIds/onSelectedRowIdsChange/isRowSelectable,
    select-all with indeterminate header, bulkActions bar
  - Server pagination: manualPagination/total/pageCount; summary and
    aria-sort stay correct without client slicing/sorting

  Forms and navigation (P1 for the profiles):

  - Input/Textarea/Select: aria-invalid visual styling (destructive border
    - ring) so FormField's error wiring is visible
  - Select: onValueChange alias (alongside onChange)
  - Switch: name renders a hidden "on" input so switches submit with forms
  - Search: controlled `value` (display follows the prop, null clears)
  - Breadcrumb: linkComponent for router links (preserves prefetch and
    modified clicks)

  AI:

  - CommandPalette: loadCommands (debounced, stale-response guarded),
    renderCommand, loadingText; Command gains icon/description

  Docs: new Link and SectionHeading pages, nav + search entries, registry
  and LLM docs regenerate to 75 components (58 core / 17 AI).

  Verified: typecheck 14/14, lint 8/8, tests 10/10, build 10/10, 75
  manifests with zero drift, docs smoke 5/5.

- [`f509885`](https://github.com/michaelmcshinsky/slipstream-ui/commit/f5098857e9fbc2ac32bded9d5d98c7d67b2582b6) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - The last P1 migration gaps: marketing chrome, content typography, TOC and
  confirmations.

  New components:

  - SiteHeader — sticky marketing header: brand, horizontal nav with
    prefix-aware active states (aria-current), right-aligned actions and a
    built-in mobile Drawer; router-agnostic via linkComponent
  - SiteFooter — brand/tagline column, link columns and a legal bar, with
    safe external links and linkComponent for routers
  - Prose — self-contained long-form typography for rendered markdown/MDX
    (headings, links, lists, code, tables, quotes, figures); no
    @tailwindcss/typography dependency, keeps Shiki/KaTeX pipelines intact
  - TableOfContents + useScrollSpy — sticky "On this page" nav with nested
    levels and aria-current, plus an IntersectionObserver scroll-spy hook
  - ConfirmDialog — accessible confirmation built on Dialog with async
    pending state, destructive variant and cancellable actions

  Docs: five new pages, nav + search entries; registry/LLM regenerate to
  80 components (63 core / 17 AI).

  Verified: typecheck 14/14, lint 8/8, tests 10/10, build 10/10, 80
  manifests with zero drift, docs smoke 6/6.

### Patch Changes

- [#66](https://github.com/michaelmcshinsky/slipstream-ui/pull/66) [`09d41c1`](https://github.com/michaelmcshinsky/slipstream-ui/commit/09d41c16a4fc6b1c08abae9bb74267efd34a6876) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add the typed i18n runtime with English, Arabic and Spanish catalogs, RTL
  direction helpers, Intl formatters and a client-only React entry. Localize the
  AI Chat Starter and add label overrides to `Reasoning` and `ToolCall`.

- [#66](https://github.com/michaelmcshinsky/slipstream-ui/pull/66) [`09d41c1`](https://github.com/michaelmcshinsky/slipstream-ui/commit/09d41c16a4fc6b1c08abae9bb74267efd34a6876) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Add the Tailwind v4 theme contract, manifest metadata for seven AI components,
  enum-value validation and JSX-children handling in `validate_usage`, and MCP
  registry metadata (`server.json` + `mcpName`). Also adds the 100-case
  validation benchmark and the AI Chat Starter.

## 0.4.0

### Minor Changes

- [`d2b9f4a`](https://github.com/michaelmcshinsky/slipstream-ui/commit/d2b9f4a90368b8ab7b844c9e4fb656c7894a6b7c) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Compound select and table shell.

  - SelectMenu: custom listbox for rich options — descriptions, icons,
    grouped headings, single/multi select, custom trigger and row
    rendering, hidden form inputs, and the full button/listbox keyboard
    model (arrows, Home/End, Enter/Space, Escape, first-letter typeahead,
    aria-activedescendant). Fills the last migration blocker from the
    dancestack audit (Radix-style compound Select with rich option content)
    without giving up the native `Select` default.
  - TableCard: list-page table shell — title/description, header actions,
    optional toolbar, edge-to-edge body (flush) and footer row for
    pagination/summary.
  - Docs pages, nav and search entries; registry/LLM docs regenerate to 73
    components (56 core / 17 AI).

- [`e6aec11`](https://github.com/michaelmcshinsky/slipstream-ui/commit/e6aec115a75f17b232d2d92d5fef83f88176f595) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Migration-readiness batch: shell, app patterns, async inputs, files, timelines.

  New components (core):

  - AppShell + Sidebar — responsive frame with a sectioned rail, sticky
    header, scrolling main and a built-in mobile Drawer; router-agnostic
    via `linkComponent` and `activeHref` (aria-current)
  - EmptyState, PageHeader, MetricCard, PasswordInput, AuthLayout,
    FilterBar — the app-pattern set every dashboard/website was hand-rolling
  - DatePicker, TimePicker — native date/time fields with ISO / HH:MM
    contracts and clear affordances
  - Stepper — ordered-list wizard indicator with aria-current=step and
    text states (not color-only)
  - FileUpload — native input + drop zone + removable list + per-file
    progress bars
  - Timeline — chronology on ordered-list semantics

  New APIs:

  - Imperative toasts: `toast.success/error/warning/info`, `toast.dismiss`,
    `toast.clear` + `<Toaster position richColors />` (useSyncExternalStore;
    provider/useToast unchanged)
  - Dialog: `size` presets (sm..2xl), `footer`, `scrollable`, `header` slot
    and composed parts (DialogHeader/DialogTitle/DialogDescription/
    DialogBody/DialogFooter) that pick up the aria ids
  - Select: `groups` (optgroups), `placeholder`, `multiple` (string[]
    contract)
  - Autocomplete: option objects, debounced async `loadOptions` with
    stale-response guard, grouped headings, descriptions, `renderOption`,
    `clearable`
  - `asChild` on Card, Badge and MenuItem for router links

  Docs: 14 new/expanded component pages, theming gains a documented
  z-index ladder, registry/LLM docs regenerate to 71 components.

- [`7bc8808`](https://github.com/michaelmcshinsky/slipstream-ui/commit/7bc8808cadabac03460a263dcde5bbde789ca640) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Pagination contracts and item summary.

  - Accept `currentPage` / `totalPages` as aliases for `page` / `pageCount`
    (migration-friendly for codebases using that naming).
  - Derive the page count from `total` + `pageSize` and render a
    "Showing 26–50 of 312 students" summary (`itemLabel`, `showSummary`).
  - Both `page` and `pageCount` are now optional; the nav falls back to
    page 1 of 1 when nothing is provided.

## 0.3.0

### Minor Changes

- [`ed44685`](https://github.com/michaelmcshinsky/slipstream-ui/commit/ed44685ac64fc8656560ffc9af19a64ad9c3bf8b) Thanks [@michaelmcshinsky](https://github.com/michaelmcshinsky)! - Minor release prep: grouping components, overlay motion, and theme polish.

  New components (core):

  - InputGroup + InputGroupAddon — flush left/right addons (ghost/muted
    surfaces) behind one outer border; FormField wiring forwards to the
    nested field; addon padding on both sides so affixes breathe next to
    the input
  - CheckboxGroup + CheckboxGroupItem — multi-select counterpart of
    RadioGroup (shared name, legend, string[] selection)
  - ButtonGroup — joined segments with collapsed borders
  - RadioCard — whole clickable section per option: native circle hidden
    (sr-only), selection via has-[:checked] border+tint, optional rounded
    corners (rounded=false for square tiles)

  New props (core):

  - Dialog/Drawer `animate` — optional fade (dialog) / side-aware slide
    (drawer) in+out via usePresence exit window; reduced motion respected;
    off by default
  - RadioGroup/CheckboxGroup `orientation` (vertical|horizontal) and
    group-level `error` (role=alert inside the single fieldset)
  - Button semantic variants success/warning/info with audited AA
    foregrounds; Tabs rounded variant; Accordion borderless+gap; DataTable
    loadingRows; Confirmation approveVariant/rejectVariant/showActions (ai)
  - GapValue accepts tokens or exact pixels across Flex/Grid/Form/
    FormLayout/Accordion

  Theme:

  - Info color retuned from sky (198) to teal (176) in both modes —
    light-mode info now passes WCAG AA (4.04 → 6.36 against ink);
    updated in docs/app/playground globals, themes create-theme, CLI init
    template, and installation docs

## 0.2.0

### Minor Changes

- Slipstream 0.2.0 — Axial-inspired dark mode, six new components, and depth across the board.

  **New components:** Fieldset, FormField (label placement, tooltip, trailing slot), Text/Heading/Block typography, Flex/FlexItem + Grid/GridItem layout, List/ListItem, Search, Autocomplete, DataTable (config-driven: custom sort icons, sticky header, density, zebra, loading skeletons, row + column callbacks).

  **Design:** full token pivot on the axial.net language — dark surface ladder (background < card < popover), crisp navy borders, light-blue primary with AA contrast in both themes, 6px radii, fixed the invalid percent-hue success/warning/info tokens.

  **Component APIs:** Tabs variant (underline) + sizes + real arrow-key navigation, Dialog showClose, Breadcrumb onItemClick, Pagination showFirst/showLast/icons, Accordion custom icon + full-width headers, Confirmation color variants, Skeleton sizing props, portalled Tooltip (no more container scroll), Menu/Popover already portalled.

  **Docs:** browser-support tables on every component page, grouped accordion sidebar, full-width shell, nine guides, interactive MCP playground, five live templates, unique per-page SEO metadata, unified CodeBlock across all examples, `type` (not `interface`) codebase-wide.
