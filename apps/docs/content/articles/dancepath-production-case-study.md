# We built a production app on Slipstream UI. Here is what broke.

*Published 2026-11-26 · Slipstream UI*

Most component-library marketing shows the happy path: install, import, ship.
This is the other half of the story. DancePath (dancepath.net) is a live,
interactive reference application — an entire competitive ballroom progression
map with governing bodies, modes, age categories, figure restrictions and
dance-up paths — built with React 19, Vite, TypeScript, Tailwind, and
`@slipstream-ui/core` for the component surface.

The app is dense: a sticky selection bar, a scrollable style panel, dialogs,
accordions, badges, empty states and a seven-column comparison table that has
to survive a 360px phone screen. Building it surfaced seven concrete gaps in
the library. The project's engineering notes are public; this article is the
publishable version, with what we changed in response and what we would ask
the library to change instead.

## 1. `SegmentedControl` cannot mark an option "unavailable but selectable"

DancePath switches between Amateur / Pro-Am / Professional, and some governing
bodies publish no Pro-Am or professional ladder. The panel that explains the
gap only appears *after* selecting the mode, so the option must stay enabled —
disabling it would hide the explanation.

The only workaround was a label suffix, which changes the visible label and
therefore the accessible name. A `hint` or `note` field on `SegmentedOption`,
rendered as a small trailing marker and exposed via `aria-description`, would
cover the case without custom rendering.

**Lesson:** a manifest that documents `options` as `{ label, value }` pairs
cannot express "selectable but qualified." Enum-like option types need a
metadata channel, not just a label.

## 2. `SegmentedControl` needs a responsive `fullWidth`

`fullWidth` is a boolean, so "fill the width on a phone, hug content on a
desktop" needed a wrapper element plus `fullWidth` on the control — the outer
div then controlled the width anyway. A `fullWidth: boolean | 'sm' | 'md' |
'lg'` or a `fullWidthFrom` prop would remove the wrapper.

**Lesson:** boolean layout props are where responsive design goes to die. The
manifest already describes variants; breakpoint-qualified variants are the
same idea one level down.

## 3. `Button` has no `xs` size for dense toolbars

The sticky selection bar needs a 32px control with 11–12px text. `size="sm"`
is `h-9`, so every use overrode `className="h-8 px-2 text-[11.5px]"` — which
defeats the token system the library exists to enforce. An `xs` size
(`h-8 text-xs`) would fit toolbars, table rows and compact headers.

**Lesson:** size scales written for marketing pages do not survive contact
with application chrome. Dense UIs are where token discipline is tested.

## 4. `Dialog` has no `initialFocus` while `autoFocus` is discouraged

The search dialog wants focus in its input on open. React and ESLint
discourage `autoFocus`, and Radix's `onOpenAutoFocus` is not exposed through
`Dialog`. `initialFocusRef` (or `initialFocusSelector`) would be the supported
path — and would belong in the manifest's accessibility section, where agents
look for it.

**Lesson:** focus management is part of the component contract. If the
manifest documents keyboard behavior, it should document *where focus lands*.

## 5. `Accordion` needs a controlled mode for externally-driven open state

The style panel's open item is the app's selected style, driven from a URL hash
and from search. `Accordion` exposed `defaultValue` and `collapsible` but no
`value`/`onValueChange` pair, so one piece of state could not drive both the
accordion and the map. We re-implemented the trigger row instead.

**Lesson:** uncontrolled-by-default is right for simple cases, but compound
components that synchronize with external state need a controlled escape
hatch documented next to the uncontrolled props.

## 6. Tables have no card fallback for phones

`ComparisonTable` and `Table` render tables. At 360–390px a seven-column table
is unreadable, and the options were hiding columns or horizontal scrolling
inside a scrolling page. A `layout="cards"` (or a `CardTable` companion) that
renders each row as a definition list under a breakpoint would remove a whole
class of custom work; DancePath now hand-rolls exactly that for the compare
panel.

**Lesson:** responsive table strategy is a library-level decision, not a
per-app one. Every consumer will hand-roll the same card layout.

## 7. `Input` with `type="search"` keeps the WebKit clear button

The browser's clear decoration doubled up with the library's focus ring and
padding on iOS. A one-line `styles.css` reset
(`input[type='search']::-webkit-search-cancel-button`) would make search inputs
look like every other field.

**Lesson:** small, but exactly the kind of papercut a shared stylesheet exists
to fix once.

## What worked

The gaps above are real, but they are the minority of the surface:

- **Subpath exports** (`@slipstream-ui/core/button`) keep the bundle honest.
  The app splits into `react` / `ui` / `vendor` / `app` chunks and the UI
  chunk is 17 kB.
- **Semantic tokens** (`bg-primary`, `text-warning-ink`, `ring-ring`) meant the
  DancePath palette dropped in without overriding component internals.
- **Accessibility held up.** `Accordion`, `Dialog`, `Badge`, `EmptyState`,
  `SegmentedControl`, `Button` and `Input` all passed axe at WCAG 2.1 AA with
  no patching — the app's own focus-ring utility is now only used on
  hand-rolled cells.
- **The manifest did its job for agents.** Every component we consumed had a
  machine-readable contract, so generated usage stayed close to correct; the
  friction was in missing *capabilities*, not in agents guessing wrong props.

## The honest scorecard

Seven gaps over one dense application is a good ratio for a component library
at this stage — most were one-prop or one-variant additions rather than design
flaws. Three of them (controlled `Accordion`, `initialFocus`, the search-input
reset) are the kind of thing a minor release fixes; the table card fallback is
the only item that is genuinely a new component.

If you are evaluating Slipstream for a production app, the useful question is
not "does it have every component" but "how painful is the gap when it does
not." DancePath's answer: survivable, documented, and mostly upstreamable.

*DancePath is an independent project; this case study is published with its
engineering notes so other teams can weigh the same trade-offs.*
