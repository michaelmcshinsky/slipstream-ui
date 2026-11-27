# Migrating from shadcn/ui to Slipstream UI

A practical guide for moving a shadcn/ui codebase to Slipstream UI. Slipstream is a drop-in
theming-compatible replacement: the CSS-variable contract, Tailwind token names, and utility
classes are deliberately the same, so most of the work is **imports and component APIs**, not
restyling.

> Status: community-grade migration guide for `@slipstream-ui/*` 0.10.x. Component APIs are
> verified against the published package exports; check the [component catalog](https://slipstreamui.com/docs/components)
> for live demos before porting complex compositions.

## TL;DR

```bash
# 1. Install the packages (replaces nothing — shadcn/ui is copied source, not a package)
pnpm add @slipstream-ui/core @slipstream-ui/themes
# add @slipstream-ui/ai if you use AI chat components

# 2. Let the CLI wire up Tailwind/theme for you
npx @slipstream-ui/cli@latest init

# 3. Swap imports
#    import { Button } from '@/components/ui/button'   (shadcn, copied source)
# -> import { Button } from '@slipstream-ui/core'       (or '@slipstream-ui/core/button')
```

Or skip the packages entirely and copy source through the shadcn-compatible registry:

```bash
npx shadcn@latest add https://slipstreamui.com/registry/button.json
# any component id works: dialog.json, data-table.json, prompt-input.json, ...
```

## How the two libraries differ (read this first)

| | shadcn/ui | Slipstream UI |
|---|---|---|
| Distribution | Copied source files in `components/ui/`, built on Radix primitives | Published npm packages **or** copied source via registry |
| Composition | Compound components (`DialogTrigger`, `DialogContent`, …) | Mostly single components with props + exported part components |
| State | Usually uncontrolled, Radix `asChild`/`Slot` patterns | Explicit `open`/`onOpenChange`, `value`/`onValueChange` controlled or uncontrolled |
| Theming | `hsl(var(--token))` CSS variables you own | Same convention — `createTheme()` emits identical variable names |
| AI support | None built-in | Per-component manifests, `validate_usage` MCP tool, `/llm/*.md` docs |

The mental-model shift: shadcn gives you Radix's primitive anatomy; Slipstream gives you a
finished component with a documented prop contract. Porting is mostly **rewriting JSX
composition into props**, not learning a new styling system.

## Install steps

1. **Install packages.** `pnpm add @slipstream-ui/core @slipstream-ui/themes` (add
   `@slipstream-ui/ai` for chat/agent components). Peer deps: React 18/19, Tailwind CSS 3.4+
   or 4.x — or use the prebuilt `@slipstream-ui/core/styles.css` with no Tailwind at all.
2. **Run init** (`npx @slipstream-ui/cli@latest init`) to detect your framework, write config,
   and emit theme variables. If you already have a shadcn `globals.css`, most of it carries
   over — see [Theming](#theming--tokens).
3. **Remove shadcn-only dependencies** once nothing imports them: the `@radix-ui/*` packages,
   `class-variance-authority`, `tailwindcss-animate`, `lucide-react` (only if unused), and your
   `components/ui/` directory. `clsx`/`tailwind-merge` may still be needed by your own code.
4. **Rewrite imports and JSX** using the table below.
5. **Keep your theme.** Your existing `--background`, `--primary`, `--radius`, etc. values
   work unchanged; or call `createTheme()` from `@slipstream-ui/themes` for presets
   (`defaultTheme`, `darkTheme`, `zincTheme`, `violetTheme`, + dark variants).

## Import paths

```ts
// Barrel import (tree-shaken by your bundler)
import { Button, Dialog, Card } from '@slipstream-ui/core';

// Per-component subpath — smaller type surface, handy for code splitting
import { Button } from '@slipstream-ui/core/button';
import { Conversation, PromptInput } from '@slipstream-ui/ai';
```

The registry path produces local source files instead:

```bash
npx shadcn@latest add https://slipstreamui.com/registry/button.json
# installs to your configured components/ui directory, e.g.
import { Button } from '@/components/ui/button';  # path stays yours
```

## Component map

Verified against `@slipstream-ui/core` 0.11.9 exports (re-checked 2026-11-27). "API notes" flag the non-obvious
prop-level differences; always check the linked docs page for the full prop table.

### Buttons & badges

| shadcn | Slipstream | Notes |
|---|---|---|
| `Button` | `Button` (+ `buttonVariants`) | Variants: `default`, `primary`, `destructive`, `outline`, `secondary`, `ghost`, `link`, plus semantic `success`/`warning`/`info` and surface variants `contrast`/`onDark`. Same `size` scale (`sm`/`default`/`lg`/`icon`). `asChild` is **not** supported — use `Link` or wrap. |
| `Badge` | `Badge` (+ `badgeVariants`) | Close variant-for-variant. |

### Forms

| shadcn | Slipstream | Notes |
|---|---|---|
| `Input` | `Input` | Drop-in. For inputs with leading/trailing icons or addons use `InputGroup` + `InputGroupAddon` instead of hand-rolled flex wrappers. |
| `Textarea` | `Textarea` | Drop-in. |
| `Label` | `Label`, `FormField` | `FormField` adds label placement (`top`/`left`), description, and error text in one wrapper — replaces the usual `FormItem`/`FormLabel`/`FormControl`/`FormMessage` stack for non-RHF forms. |
| `Input` (file) | `FileUpload` | Styled file input with the same `onChange` contract. |
| `Checkbox` | `Checkbox`, `CheckboxGroup` | `CheckboxGroup` handles the `name`/orientation/group-label boilerplate shadcn leaves to you. |
| `RadioGroup` | `RadioGroup`, `RadioGroupItem`, `Radio`, `RadioCard` | `RadioCard` covers the "selectable card" pattern shadcn users build by hand. |
| `Switch` | `Switch` | Drop-in (`checked`/`onCheckedChange`). |
| `Select` | `Select` **or** `SelectMenu` | Biggest API difference in this table. `Select` is a styled **native `<select>`** — options via `options`/`groups` props or `<option>` children, works with `react-hook-form` `register()`. `SelectMenu` is the Radix-style dropdown: `items` array, `value`/`onValueChange` (string or string[]), `multiple`, `renderItem`/`renderValue` for rich rows. Pick `Select` for simple forms; `SelectMenu` when you need icons/descriptions in options. |
| `Slider` | `RangeSlider` | Verify single-vs-range behavior in the docs before porting a one-thumb slider. |
| `Form` (RHF wrapper) | `Form`, `FormField` | Slipstream's `Form` is a styled `<form>` (`variant: default|card|inline`), **not** a react-hook-form context provider. Keep using `react-hook-form`'s own `FormProvider` and feed values into Slipstream fields. |
| `Calendar` / `Popover` date picker | `Calendar`, `DatePicker`, `DatePickerPopover`, `DateRangePicker`, `TimePicker` | `DatePicker` is a text-input-with-popup; `DatePickerPopover` composes `Calendar` in a `Popover`. `DateRangePicker` covers the range case. |

### Overlays & feedback

| shadcn | Slipstream | Notes |
|---|---|---|
| `Dialog` | `Dialog` + `DialogHeader`/`DialogTitle`/`DialogDescription`/`DialogBody`/`DialogFooter` | Controlled: `open` + `onOpenChange` required. `title`/`description` props auto-wire ARIA; or pass `header`/`footer` React nodes and compose the part components. `size` presets replace max-width classes. No `DialogTrigger` — render your own button and set `open`. |
| `AlertDialog` | `ConfirmDialog` | Purpose-built confirm/cancel dialog (`open`/`onOpenChange`, confirm/cancel labels). |
| `Sheet` | `Drawer` | `side: left|right|top|bottom`, `size` presets. Same controlled-open pattern as `Dialog`. |
| `Popover` | `Popover`, `PopoverTrigger`, `PopoverAnchor`, `PopoverContent` | Compound but controlled via `open`/`onOpenChange` on `Popover`. |
| `Tooltip` | `Tooltip` | Single component — check docs for the trigger/content composition. |
| `DropdownMenu` | `Menu`, `MenuTrigger`, `MenuContent`, `MenuItem`, `MenuSeparator`, `MenuLabel` | Compound with `open`/`onOpenChange` on `Menu`. Keyboard nav built in. |
| `Sonner` / `Toaster` | `Toaster` + `toast` + `ToastProvider`/`useToast` | Mount `<Toaster />` once; call `toast.success(...)` etc. `position` and `richColors` props. |
| `Alert` | `Alert`, `AlertTitle`, `AlertDescription` (+ `alertVariants`) | Drop-in. Variants include semantic status tones. |
| `Progress` | `Progress` | Drop-in. |
| `Skeleton` | `Skeleton` | Drop-in. |
| `Separator` | `Separator` | Drop-in. |

### Data display & navigation

| shadcn | Slipstream | Notes |
|---|---|---|
| `Table` | `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableRow`, `TableHead`, `TableCell`, `TableCaption` | Same compound anatomy as shadcn — closest to a true drop-in. |
| `data-table` (TanStack) | `DataTable` | `DataTableColumn<T>[]` + generic `DataTable<T>`; sorting built in. You still own TanStack Table if you need its full feature set — check the docs page for the supported subset. |
| `Tabs` | `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` | Same anatomy; adds `variant` and `size` props. Controlled via `value`/`onValueChange`. |
| `Accordion` | `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` | Same anatomy. |
| `Breadcrumb` | `Breadcrumb` | Single component taking an `items` array — not compound. Rewrite `<BreadcrumbList><BreadcrumbItem>…` into data. |
| `Pagination` | `Pagination` | Single component with props (including `PaginationIcons` for custom icons) — not the shadcn compound set. |
| `Avatar` | `Avatar`, `AvatarImage`, `AvatarFallback` | Same anatomy (Radix-based under the hood). |
| `Card` | `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter` | Same anatomy. |

### AI components (no shadcn equivalent)

`@slipstream-ui/ai` has no shadcn counterpart — these are the reason to migrate beyond
parity: `Conversation`, `Message`, `Response`, `StreamingResponse`, `PromptInput`,
`Reasoning`, `ToolCall`, `Source`, `Suggestion`, `CommandPalette`, `CodeBlock`,
`InlineCitation`, `MessageActions`, `Attachment`, `Branch`, `ChainThought`, `Confirmation`.
They are stateless: you bring the transport (Vercel AI SDK, LangGraph, raw streams).

## Theming & tokens

This is where migration is cheapest — Slipstream deliberately kept shadcn's variable
contract:

- **Same variable names.** `createTheme()` (`@slipstream-ui/themes`) emits `--background`,
  `--foreground`, `--card`, `--popover`, `--primary`, `--secondary`, `--muted`, `--accent`,
  `--destructive`, `--border`, `--input`, `--ring`, `--radius` (+ `-foreground` pairs), plus
  extras shadcn lacks: `--success`, `--warning`, `--info` (each with `-foreground` and `-ink`
  for text on tinted surfaces), `--inverse-*`, `--density-*`, `--motion-*`.
- **Same value format.** Variables hold raw HSL channel triplets (`224 89% 53%`), consumed as
  `hsl(var(--primary))` — identical to shadcn's convention. Your existing `globals.css`
  values drop in unchanged.
- **Same Tailwind tokens.** `bg-card`, `text-muted-foreground`, `border-border`,
  `rounded-lg`, `bg-primary text-primary-foreground` all resolve the same way. Custom utility
  classes you wrote against shadcn tokens keep working.
- **Dark mode.** Both use a `.dark` class (Slipstream also honors `data-theme="dark"`).
  Presets: `darkTheme`, `zincTheme`/`zincDarkTheme`, `violetTheme`/`violetDarkTheme`.
- **New for free:** status colors (`success`/`warning`/`info`) with accessible ink variants,
  density and motion tokens, and `themeToCssVariables(theme)` for SSR style injection.

## What has no equivalent yet

Honest gaps as of 0.10.x — keep these files from shadcn or reach for the listed
alternative:

| shadcn component | Status | Alternative |
|---|---|---|
| `carousel` | None | Build with a scroll container or keep shadcn's `embla-carousel-react` source |
| `scroll-area` | None | Native `overflow-auto` + styled scrollbar CSS |
| `resizable` | None | `react-resizable-panels` directly |
| `aspect-ratio` | None | Tailwind `aspect-*` utilities |
| `hover-card` | None | `Popover` with hover intent (not identical) |
| `navigation-menu` | Partial | `SiteHeader` covers marketing nav; no full nav-menu primitive |
| `menubar`, `context-menu` | None | `Menu` covers dropdown menus only |
| `toggle`, `toggle-group` | None | `Button` with `variant` + `aria-pressed` |
| `chart` (Recharts wrapper) | None | Recharts directly; `MetricCard`/`StatBand` for summary tiles |
| `sidebar` | Partial | `AppShell` + `BottomNav` cover app chrome, not a resizable sidebar |
| `command` | Different | `@slipstream-ui/ai`'s `CommandPalette` is AI-oriented; for a generic command menu keep shadcn's `cmdk` source |

## Codemod-ish quick wins

```sh
# 1. Find every shadcn import
grep -rn "components/ui/" src/ --include='*.tsx' --include='*.ts'

# 2. Most mechanical renames (same export name, new path):
#    '@/components/ui/button'   -> '@slipstream-ui/core/button'
#    '@/components/ui/card'     -> '@slipstream-ui/core/card'
#    '@/components/ui/table'    -> '@slipstream-ui/core/table'
#    '@/components/ui/tabs'     -> '@slipstream-ui/core/tabs'
#    '@/components/ui/accordion'-> '@slipstream-ui/core/accordion'
#    '@/components/ui/avatar'   -> '@slipstream-ui/core/avatar'

# 3. Renames to learn:
#    alert-dialog -> ConfirmDialog     sheet -> Drawer
#    sonner/toaster -> Toaster + toast dropdown-menu -> Menu(+parts)
#    select -> Select or SelectMenu (see table)
#    breadcrumb/pagination -> data-prop components (rewrite JSX)
#    dialog/alert-dialog/sheet -> controlled open/onOpenChange (remove Trigger parts)
```

## Gotchas

- **No `asChild`.** shadcn's `Slot`-based composition (`<Button asChild><Link/></Button>`)
  doesn't exist. Render the element directly or restyle — `Button` has a `link` variant for
  link-styled actions.
- **Controlled overlays.** `Dialog`, `Drawer`, `Menu`, `Popover`, `ConfirmDialog` take
  `open`/`onOpenChange`. You own the trigger button — there are no `*Trigger` parts on
  `Dialog`/`Drawer`/`ConfirmDialog` (unlike shadcn).
- **`Select` is native.** If your shadcn `Select` relied on rich option content or portal
  behavior, use `SelectMenu` instead — but note its `items`-array API differs from
  `SelectItem` children.
- **Forms.** Slipstream fields are controlled/uncontrolled native inputs; they compose with
  `react-hook-form` (`register()` works on `Input`, `Select`, `Textarea`) but there is no
  `FormField` context wrapper — use the `FormField` layout component or RHF's own.
- **Manifest drift protection.** Every Slipstream component has a machine-readable manifest
  (`/llm/components/<id>.md`, or the MCP `get_component_manifest`/`validate_usage` tools).
  If an AI agent writes code against Slipstream, point it at those — hallucinated props are
  exactly what `validate_usage` rejects.

## Further reading

- [Component catalog](https://slipstreamui.com/docs/components) — live demos + prop tables
- [Theming docs](https://slipstreamui.com/docs/theming) — `createTheme()` and the token contract
- [MCP server setup](https://slipstreamui.com/docs/mcp) — let your agent validate usage
- [Compatibility notes](https://slipstreamui.com/docs/compatibility) — Tailwind v3/v4, React 18/19
