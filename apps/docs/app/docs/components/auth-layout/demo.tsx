'use client';

import { AuthLayout, Button, FormField, Input, PasswordInput } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function AuthLayoutPage() {
  return (
    <ComponentPage
      id="auth-layout"
      title="AuthLayout"
      description="Centered authentication surface: brand, title/description, form card and footer, with size presets."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Card heading (h1).' },
        { name: 'description', type: 'string', description: 'Supporting line under the heading.' },
        { name: 'brand', type: 'ReactNode', description: 'Mark rendered above the card.' },
        { name: 'footer', type: 'ReactNode', description: 'Links/legal copy under the card.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Card width preset.' },
      ]}
      accessibility={['Owns the page h1; keep the form free of additional h1s.', 'Centered layout keeps the form reachable on small screens.']}
    >
      <DemoCard
        title="Sign in"
        preview={
          <div className="w-full overflow-hidden rounded-xl border border-border">
            <div className="scale-100 [&>div]:min-h-[24rem]">
              <AuthLayout
                title="Sign in"
                description="Welcome back to Acme Studio."
                footer={<span>New here? <a className="text-primary hover:underline" href="#signup">Create an account</a></span>}
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
  description="Welcome back to Acme Studio."
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
};`}
      />
    </ComponentPage>
  );
}
