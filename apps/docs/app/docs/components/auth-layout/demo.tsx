'use client';

import { AuthLayout, Button, FormField, Input, PasswordInput } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function AuthLayoutPage() {
  return (
    <ComponentPage
      id="auth-layout"
      title="AuthLayout"
      description="Authentication surface with a centered card or a split form/aside layout, plus brand, title, footer and size presets."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Card heading (h1).' },
        { name: 'description', type: 'string', description: 'Supporting line under the heading.' },
        { name: 'subtitle', type: 'string', description: 'Alias for description (migration-friendly).' },
        { name: 'brand', type: 'ReactNode', description: 'Mark rendered above the card.' },
        { name: 'logo', type: 'ReactNode', description: 'Alias for brand (migration-friendly).' },
        { name: 'footer', type: 'ReactNode', description: 'Links/legal copy under the card.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Card width preset.' },
        { name: 'variant', type: "'centered' | 'split'", defaultValue: "'centered'", description: 'Split renders the form beside an aside on desktop.' },
        { name: 'aside', type: 'ReactNode', description: 'Optional panel for the split variant; omitting it falls back to centered.' },
        { name: 'maxWidth', type: 'number | string', description: 'Overrides the card width: pixels (420) or any CSS width ("26rem").' },
      ]}
      accessibility={['Owns the page h1; keep the form free of additional h1s.', 'Centered layout keeps the form reachable on small screens.', 'The split variant keeps DOM order form then aside, so keyboard order stays correct.']}
    >
      <DemoCard
        title="Sign in"
        preview={
          <div className="w-full overflow-hidden rounded-xl border border-border">
            <div className="scale-100 [&>div]:min-h-[24rem]">
              <AuthLayout
                title="Sign in"
                description="Welcome back to Example App."
                footer={<span>New here? <a className="text-primary underline underline-offset-2 hover:text-primary/80" href="#signup">Create an account</a></span>}
              >
                <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
                  <FormField id="auth-email" label="Email">
                    <Input type="email" autoComplete="email" placeholder="you@example.com" />
                  </FormField>
                  <FormField id="auth-password" label="Password">
                    <PasswordInput autoComplete="current-password" />
                  </FormField>
                  <Button type="submit" className="w-full">Sign in</Button>
                </form>
              </AuthLayout>
            </div>
          </div>
        }
        code={`<AuthLayout
  title="Sign in"
  description="Welcome back to Example App."
  footer={<a href="/signup">Create an account</a>}
>
  <Form onSubmit={signIn}>
    <FormField id="email" label="Email"><Input type="email" /></FormField>
    <FormField id="password" label="Password"><PasswordInput /></FormField>
    <Button type="submit">Sign in</Button>
  </Form>
</AuthLayout>`}
        usage={`// Use the same layout for sign-in, sign-up, reset and verify so the
// auth flow never changes shape between steps.`}
        types={`type AuthLayoutProps = {
  title: string;
  description?: string;
  brand?: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'centered' | 'split';
  aside?: React.ReactNode;
};`}
      />

      <DemoCard
        title="Split with an aside"
        preview={
          <div className="w-full overflow-hidden rounded-xl border border-border">
            <div className="[&>div]:min-h-[28rem]">
              <AuthLayout
                variant="split"
                title="Sign in"
                description="Welcome back to Example App."
                aside={
                  <div className="rounded-xl border border-border bg-card p-8">
                    <p className="text-lg font-medium leading-relaxed">
                      &ldquo;Slipstream cut our auth screens from a week to an afternoon.&rdquo;
                    </p>
                    <p className="mt-3 text-sm text-muted-foreground">Jane Doe, Product Lead at Example</p>
                    <dl className="mt-8 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <dt className="text-xs text-muted-foreground">Teams</dt>
                        <dd className="text-xl font-semibold">240</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Countries</dt>
                        <dd className="text-xl font-semibold">38</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-muted-foreground">Uptime</dt>
                        <dd className="text-xl font-semibold">99.9%</dd>
                      </div>
                    </dl>
                  </div>
                }
              >
                <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
                  <FormField id="split-email" label="Email">
                    <Input type="email" autoComplete="email" placeholder="you@example.com" />
                  </FormField>
                  <FormField id="split-password" label="Password">
                    <PasswordInput autoComplete="current-password" />
                  </FormField>
                  <Button type="submit" className="w-full">Sign in</Button>
                </form>
              </AuthLayout>
            </div>
          </div>
        }
        code={`<AuthLayout
  variant="split"
  title="Sign in"
  description="Welcome back to Example App."
  aside={<BrandAside />}
>
  <SignInForm />
</AuthLayout>`}
        usage={`// The aside sits beside the form at 1280 and below it at 390.
// Omit the aside (or use variant="centered") for the single-column screen.`}
      />
    </ComponentPage>
  );
}
