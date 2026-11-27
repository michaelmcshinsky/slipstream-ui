---
'@slipstream-ui/core': patch
---

`DataTable` gains `cardLayout`: a responsive fallback that renders each row as a definition-list card (column headers become field labels) below a breakpoint — `true` switches below `md` (768px), or pass `'sm' | 'md' | 'lg' | 'xl' | '2xl'` to choose. Both layouts render and swap via CSS only, so sorting, selection, pagination, and row callbacks behave identically in each; the table is `display:none` below the breakpoint so assistive tech sees one layout at a time.
