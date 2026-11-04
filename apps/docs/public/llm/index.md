# Slipstream UI — LLM Documentation Index

The AI-first React component library. 80 components, each shipping a
machine-readable COMPONENT_MANIFEST; this directory mirrors those manifests as markdown.

- Library docs: https://slipstreamui.com/docs
- Manifest registry: https://slipstreamui.com/registry/all.json
- Single-file corpus: https://slipstreamui.com/llms-full.txt
- shadcn-compatible install: `npx shadcn@latest add https://slipstreamui.com/registry/<id>.json`

## Core components (@slipstream-ui/core) — 63

- [Accordion](https://slipstreamui.com/llm/components/accordion.md) — Collapsible content sections with ARIA accordion semantics and keyboard navigation
- [Alert](https://slipstreamui.com/llm/components/alert.md) — Inline alert for status messages with semantic variants (destructive, success, warning, info)
- [AppShell](https://slipstreamui.com/llm/components/app-shell.md) — Application frame with a sectioned sidebar, sticky header and scrolling main; the sidebar becomes a left Drawer on small screens.
- [AuthLayout](https://slipstreamui.com/llm/components/auth-layout.md) — Centered authentication surface: brand, title/description, form card and footer, with size presets.
- [Autocomplete](https://slipstreamui.com/llm/components/autocomplete.md) — Free-text type-ahead input with a portalled listbox: static or async options, grouped headings, descriptions and custom rows.
- [Avatar](https://slipstreamui.com/llm/components/avatar.md) — A user profile image component with fallback support and accessible image loading
- [Badge](https://slipstreamui.com/llm/components/badge.md) — A small status indicator component for displaying tags, counts, or status information
- [Block](https://slipstreamui.com/llm/components/block.md) — Semantic container (div by default, swappable element) — the structural counterpart to Text (p).
- [Breadcrumb](https://slipstreamui.com/llm/components/breadcrumb.md) — Navigation breadcrumb trail with links and current-page indicator
- [Button](https://slipstreamui.com/llm/components/button.md) — A clickable button component with variants for different visual styles and sizes
- [ButtonGroup](https://slipstreamui.com/llm/components/button-group.md) — Joins buttons into one segmented control: adjacent borders collapse, middle corners square off, and only the outer corners stay rounded — a single outline around the group.
- [Card](https://slipstreamui.com/llm/components/card.md) — A content container with header, body, and footer sections for grouping related information
- [Checkbox](https://slipstreamui.com/llm/components/checkbox.md) — A native checkbox input styled to match the design system, plus CheckboxGroup for grouping related options under an accessible legend
- [ConfirmDialog](https://slipstreamui.com/llm/components/confirm-dialog.md) — Accessible confirmation dialog with async pending state, destructive variant and cancellable actions, built on Dialog.
- [DataTable](https://slipstreamui.com/llm/components/data-table.md) — Config-driven table: one component plus a columns config that owns shape, sorting, pagination, and row interaction.
- [DatePicker](https://slipstreamui.com/llm/components/date-picker.md) — Native date field with an ISO-string contract, min/max passthrough and an optional clear button.
- [Dialog](https://slipstreamui.com/llm/components/dialog.md) — Accessible modal dialog with focus trap/restore, backdrop and Escape dismissal, size presets, optional header/footer slots, a scrollable body, and opt-in fade motion.
- [Drawer](https://slipstreamui.com/llm/components/drawer.md) — Edge sheet for secondary flows: slides from any side (sm/md/lg), with Dialog-grade modal semantics (portal, focus trap, Escape, focus restoration).
- [EmptyState](https://slipstreamui.com/llm/components/empty-state.md) — Placeholder for empty collections, zero-result searches and unconfigured features, with title, description and action slots.
- [Fieldset](https://slipstreamui.com/llm/components/fieldset.md) — Groups related form controls in a native fieldset with a legend, optional description, and an error slot.
- [FileUpload](https://slipstreamui.com/llm/components/file-upload.md) — Drag-and-drop file picker with a removable file list and per-file progress bars.
- [FilterBar](https://slipstreamui.com/llm/components/filter-bar.md) — List-page filter strip: search field, filter controls, reset affordance and trailing actions.
- [Flex / FlexItem](https://slipstreamui.com/llm/components/flex.md) — Typed flexbox container (direction/align/justify/wrap/gap) with FlexItem for per-child grow/shrink/basis controls.
- [Form](https://slipstreamui.com/llm/components/form.md) — Semantic form element with even-spacing layouts: stacked (default), bordered card, or inline row — native submit and validation untouched.
- [FormField](https://slipstreamui.com/llm/components/form-field.md) — Label + control + hint/error in one unit with htmlFor, aria-describedby, and aria-invalid wiring applied automatically.
- [FormLayout](https://slipstreamui.com/llm/components/form-layout.md) — Groups form fields with even, tokenized spacing: vertical stack, horizontal row, or 1-4 column grid, optionally as a semantic fieldset.
- [Grid / GridItem](https://slipstreamui.com/llm/components/grid.md) — Typed CSS grid with column counts per breakpoint (literal utilities that survive purging), auto-fit min-column mode, and GridItem spans.
- [Heading](https://slipstreamui.com/llm/components/heading.md) — Semantic heading (h1-h6) with a safe default scale and an optional visual-size override.
- [Input](https://slipstreamui.com/llm/components/input.md) — A text input field with support for various input types and standard HTML input attributes
- [InputGroup](https://slipstreamui.com/llm/components/input-group.md) — Composite input shell with flush left/right addons (icons, units, buttons) behind one outer outline; the nested field sheds its own border so the group reads as a single control.
- [Label](https://slipstreamui.com/llm/components/label.md) — An accessible form label that associates with its control
- [Link](https://slipstreamui.com/llm/components/link.md) — Inline link primitive with default/muted/underline/arrow/external variants, asChild router support and safe external handling.
- [List / ListItem](https://slipstreamui.com/llm/components/list.md) — Semantic list (ul/li) for rows of related items: settings, results, nav — with leading/trailing slots, selection, and pressable rows.
- [Menu](https://slipstreamui.com/llm/components/menu.md) — Dropdown menu with keyboard navigation, typeahead, and ARIA menu semantics
- [MetricCard](https://slipstreamui.com/llm/components/metric-card.md) — KPI tile: label, value, directional delta (arrow + color) and supporting hint.
- [PageHeader](https://slipstreamui.com/llm/components/page-header.md) — Standard page heading: optional breadcrumbs, level-1 title, description, right-aligned actions and a sub-row slot.
- [Pagination](https://slipstreamui.com/llm/components/pagination.md) — Numeric pagination with prev/next and boundary jumps; accepts page/pageCount or currentPage/totalPages and derives the count (plus a Showing X-Y of Z summary) from total/pageSize.
- [PasswordInput](https://slipstreamui.com/llm/components/password-input.md) — Password field with an accessible show/hide toggle (aria-pressed), built on Input.
- [Popover](https://slipstreamui.com/llm/components/popover.md) — Floating panel anchored to a trigger with interactive content, closing on outside click and Escape
- [Progress](https://slipstreamui.com/llm/components/progress.md) — A determinate progress bar with role=progressbar and exact value semantics
- [Prose](https://slipstreamui.com/llm/components/prose.md) — Self-contained long-form typography for rendered markdown/MDX: headings, links, lists, code, tables, quotes and figures.
- [Radio](https://slipstreamui.com/llm/components/radio.md) — Native radio buttons grouped for mutually exclusive choices, with an accessible fieldset/legend wrapper
- [Search](https://slipstreamui.com/llm/components/search.md) — Select-with-search: type to filter a full-width dropdown of options, or arrow through the full set from an empty query.
- [SectionHeading](https://slipstreamui.com/llm/components/section-heading.md) — Section heading block: eyebrow, title (level 2-4), description and actions, with left/center alignment and three sizes.
- [Select](https://slipstreamui.com/llm/components/select.md) — Accessible select built on the native <select> with flat options, optgroups, a placeholder row and native multi-select.
- [SelectMenu](https://slipstreamui.com/llm/components/select-menu.md) — Custom listbox select for rich options: descriptions, icons, groups, multi-select, custom rows and hidden inputs for forms.
- [Separator](https://slipstreamui.com/llm/components/separator.md) — A visual divider between content blocks, decorative or semantic
- [SiteFooter](https://slipstreamui.com/llm/components/site-footer.md) — Marketing footer: brand + tagline column, link columns and a legal bar; router-agnostic via linkComponent.
- [SiteHeader](https://slipstreamui.com/llm/components/site-header.md) — Marketing/site header: sticky bar with brand, horizontal navigation with prefix-aware active states, right-aligned actions and a mobile drawer.
- [Skeleton](https://slipstreamui.com/llm/components/skeleton.md) — A loading placeholder that mirrors the shape of upcoming content
- [Spinner](https://slipstreamui.com/llm/components/spinner.md) — Indeterminate loading indicator with accessible status semantics.
- [Stepper](https://slipstreamui.com/llm/components/stepper.md) — Multi-step flow indicator: ordered list, aria-current step, text state for complete/current/upcoming.
- [Switch](https://slipstreamui.com/llm/components/switch.md) — A toggle switch for binary settings, with role=switch and aria-checked
- [Table](https://slipstreamui.com/llm/components/table.md) — Semantic data table with headers, body, footer, and accessible caption
- [TableCard](https://slipstreamui.com/llm/components/table-card.md) — Table shell with title/description, header actions, optional toolbar, edge-to-edge body and a footer row.
- [TableOfContents](https://slipstreamui.com/llm/components/table-of-contents.md) — Sticky 'On this page' navigation with nested levels and aria-current, plus a useScrollSpy hook for the active heading.
- [Tabs](https://slipstreamui.com/llm/components/tabs.md) — Tabbed content container with ARIA tablist semantics and keyboard navigation
- [Text](https://slipstreamui.com/llm/components/text.md) — Semantic paragraph text with a controlled type scale; renders a real p (or span with inline).
- [Textarea](https://slipstreamui.com/llm/components/textarea.md) — A multi-line text input styled to match Input, wrapping the native textarea
- [TimePicker](https://slipstreamui.com/llm/components/time-picker.md) — Native time field with an HH:MM contract and an optional clear button.
- [Timeline](https://slipstreamui.com/llm/components/timeline.md) — Vertical chronology for experience, activity and audit trails, built on an ordered list.
- [Toast](https://slipstreamui.com/llm/components/toast.md) — Accessible notifications: tree-scoped provider/hook plus an imperative toast() API rendered by <Toaster />.
- [Tooltip](https://slipstreamui.com/llm/components/tooltip.md) — Hover/focus tooltip with aria-describedby association, delay, and Escape dismissal

## AI components (@slipstream-ui/ai) — 17

- [Attachment / AttachmentList](https://slipstreamui.com/llm/components/attachment.md) — File chips for prompts and messages. `Attachment` renders one file; `AttachmentList` renders a wrapping row. Display-only: upload and file-system logic stay in the consumer.
- [Branch](https://slipstreamui.com/llm/components/branch.md) — Variant navigation for branched messages: previous/next arrows with an N/M position indicator.
- [ChainThought](https://slipstreamui.com/llm/components/chain-thought.md) — Displays ordered reasoning steps with status indicators.
- [CodeBlock](https://slipstreamui.com/llm/components/code-block.md) — Syntax-highlighted code block with language label and copy-to-clipboard button.
- [CommandPalette](https://slipstreamui.com/llm/components/command-palette.md) — Cmd+K style command palette with lexical search, sectioned results and full keyboard navigation
- [Confirmation](https://slipstreamui.com/llm/components/confirmation.md) — Human-in-the-loop approval gate for agent actions. Pauses execution until the user approves or rejects.
- [Conversation](https://slipstreamui.com/llm/components/conversation.md) — A container for displaying a list of chat messages with auto-scroll and loading states
- [InlineCitation](https://slipstreamui.com/llm/components/inline-citation.md) — Perplexity-style inline citation chip that reveals the source title and snippet on hover or keyboard focus.
- [Message](https://slipstreamui.com/llm/components/message.md) — A chat message component that displays messages from users, assistants, or system prompts with optional avatars
- [MessageActions](https://slipstreamui.com/llm/components/message-actions.md) — Feedback toolbar for an AI response: copy to clipboard, thumbs up/down rating, and regenerate. Every action is a callback; the component holds no conversation state.
- [PromptInput](https://slipstreamui.com/llm/components/prompt-input.md) — A textarea input for entering chat prompts with auto-resize, keyboard shortcuts, and send button
- [Reasoning](https://slipstreamui.com/llm/components/reasoning.md) — A collapsible component for displaying AI reasoning steps and chain-of-thought processes
- [Response](https://slipstreamui.com/llm/components/response.md) — Streaming-optimized markdown renderer for AI responses with GFM support, streaming-safe repair of incomplete syntax, and highlighted code blocks with copy.
- [Source / Sources](https://slipstreamui.com/llm/components/source.md) — Displays citations and references for an AI response. `Source` renders a single citation; `Sources` renders a numbered list with an overflow count.
- [StreamingIndicator](https://slipstreamui.com/llm/components/streaming-indicator.md) — Shows that an AI response is currently streaming.
- [Suggestions](https://slipstreamui.com/llm/components/suggestions.md) — Displays clickable follow-up prompts for AI interactions.
- [ToolCall](https://slipstreamui.com/llm/components/tool-call.md) — A component for displaying AI tool/function calls with status, arguments, and results

## Usage guidance

1. Read the component .md page before generating code — it lists exact prop names,
   required props, anti-patterns, and accessibility requirements.
2. Never invent props not present in the Props table.
3. Components are stateless and uncontrolled unless documented otherwise;
   consumers own conversation/thread state.
