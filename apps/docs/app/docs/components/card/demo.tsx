import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@slipstream-ui/core';

export default function CardPage() {
  return (
    <ComponentPage
      id="card"
      title="Card"
      description="Content container with header, body, and footer sections — bordered, borderless, or compact via className."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'children', type: 'ReactNode', description: 'Card sub-components: CardHeader, CardTitle, CardDescription, CardContent, CardFooter.' },
        { name: 'asChild', type: 'boolean', defaultValue: 'false', description: 'Render the child element (router Link, <a>) with card styling instead of a div.' },
        { name: 'className', type: 'string', description: 'Variants: borderless (border-0 shadow-sm), compact (p-4), raised (shadow-md), etc.' },
        { name: 'CardHeader / CardContent / CardFooter className', type: 'string', description: 'Per-section spacing overrides for compact or custom layouts.' },
      ]}
      accessibility={[
        'CardTitle renders as h3; maintain logical heading order in your page.',
        'Cards are generic containers — give interactive content inside them real labels and roles.',
        'Do not nest landmark roles (header/footer inside cards stay neutral divs).',
      ]}
    >
      <DemoCard
        title="Full anatomy"
        preview={
          <div className="grid w-full gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your account settings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Form fields here.</p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button size="sm">Save</Button>
                <Button size="sm" variant="ghost">Cancel</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle>Usage this month</CardTitle>
                  <CardDescription>Last 30 days</CardDescription>
                </div>
                <Badge variant="secondary">+18%</Badge>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">1,284</p>
                <p className="text-xs text-muted-foreground">events processed</p>
              </CardContent>
              <CardFooter className="justify-between text-xs text-muted-foreground">
                <span>Updated 2 minutes ago</span>
                <Button size="sm" variant="link" className="h-auto p-0">View report</Button>
              </CardFooter>
            </Card>
          </div>
        }
        code={`import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter, Button, Badge,
} from '@slipstream-ui/core';

<Card>
  <CardHeader>
    <CardTitle>Profile</CardTitle>
    <CardDescription>Manage your account settings</CardDescription>
  </CardHeader>
  <CardContent>{/* form fields */}</CardContent>
  <CardFooter className="gap-2">
    <Button size="sm">Save</Button>
    <Button size="sm" variant="ghost">Cancel</Button>
  </CardFooter>
</Card>

{/* Header row with trailing badge: flex-row + space-y-0 */}
<CardHeader className="flex-row items-center justify-between space-y-0">…</CardHeader>`}
      />

      <DemoCard
        title="Variants"
        preview={
          <div className="grid w-full gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Bordered (default)</p>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Default card</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Border + subtle background.
                </CardContent>
              </Card>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Borderless</p>
              <Card className="border-0 bg-muted/40 shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle>Borderless card</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <code className="rounded bg-background px-1">border-0 shadow-none</code> — sits on the page like a panel.
                </CardContent>
              </Card>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Compact</p>
              <Card className="p-0">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm">Compact card</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                  Tighter padding for dense lists and sidebars.
                </CardContent>
              </Card>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Raised</p>
              <Card className="border-0 shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle>Raised card</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <code className="rounded bg-muted px-1">border-0 shadow-md</code> — emphasis without a border.
                </CardContent>
              </Card>
            </div>
          </div>
        }
        code={`{/* Variants are className recipes — no extra components needed */}

{/* Borderless */}
<Card className="border-0 bg-muted/40 shadow-none">…</Card>

{/* Compact: pad the card, tighten each section */}
<Card className="p-0">
  <CardHeader className="p-4 pb-2"><CardTitle className="text-sm">Title</CardTitle></CardHeader>
  <CardContent className="p-4 pt-0 text-sm">Body</CardContent>
</Card>

{/* Raised */}
<Card className="border-0 shadow-md">…</Card>`}
      />

      <DemoCard
        title="Header & footer layouts"
        preview={
          <div className="grid w-full gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Header only</CardTitle>
                <CardDescription>Cards compose — use the sections you need.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="p-0">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Content only — no header, no footer.</p>
              </CardContent>
              <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
                <span>Footer via CardFooter</span>
                <span>← split ends</span>
              </div>
            </Card>
          </div>
        }
        code={`{/* Sections are optional and stack in order */}
<Card>
  <CardHeader>…</CardHeader>
</Card>

<Card className="p-0">
  <CardContent className="p-4">…</CardContent>
  <CardFooter className="justify-between border-t border-border px-4 py-3">
    <span>Left</span>
    <span>Right</span>
  </CardFooter>
</Card>`}
      />
    </ComponentPage>
  );
}
