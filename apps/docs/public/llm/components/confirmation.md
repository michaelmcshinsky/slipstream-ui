# Confirmation

Human-in-the-loop approval gate for agent actions. Pauses execution until the user approves or rejects.

> Import: `import { Confirmation } from '@slipstream-ui/ai'`
> Registry: https://slipstreamui.com/registry/confirmation.json
> Tier: molecule · Package: @slipstream-ui/ai

## Design intent

Make destructive or consequential tool calls require explicit user consent.

## Props

| Prop | Type | Default | Required | Description |
|---|---|---|---|---|
| title | `string` | — | yes | Summary of the action requiring approval. |
| description | `string` | — | no | Detail: affected resource or risk note. |
| toolName | `string` | — | no | Tool/action name shown as mono text. |
| status | `'pending' | 'approved' | 'rejected'` | `pending` | no | Controlled outcome; omit for uncontrolled. |
| variant | `'default' | 'warning' | 'destructive' | 'info' | 'success'` | `default` | no | Accent color of the pending card; outcome chips always follow the result. |
| onApprove | `() => void` | — | no | Called on approval. |
| onReject | `() => void` | — | no | Called on rejection. |
| labels | `object` | — | no | Overrides for approve/reject/approved/rejected labels. |
| approveVariant | `'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'` | `default` | no | Button variant for the approve action. |
| rejectVariant | `'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'` | `outline` | no | Button variant for the reject action. |
| showActions | `boolean` | `true` | no | Hide the action buttons (controlled-only gate; status drives the chip). |

## Examples

### Gate a destructive tool

```tsx
<Confirmation title="Delete all files?" toolName="delete_all" onApprove={run} onReject={cancel} />
```

## Anti-patterns

- **Do not auto-approve after timeout** — Silent approval defeats the safety purpose; keep waiting or fail explicitly.

## Accessibility

- **Dialog semantics**: Pending state renders role=alertdialog labeled by the title.
- **Outcome announcement**: Status chip text announces Approved/Rejected.

