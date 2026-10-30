import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Breadcrumb } from '@slipstream-ui/core';

export default function BreadcrumbPage() {
  return (
    <ComponentPage
      id="breadcrumb"
      title="Breadcrumb"
      description="Navigation breadcrumb trail with links and current-page indicator."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'items', type: 'BreadcrumbItem[]', description: 'Ordered breadcrumb items; the last is the current page.' },
        { name: 'separator', type: 'ReactNode', defaultValue: "'/'", description: 'Separator character between items.' },
      ]}
      accessibility={[
        'nav[aria-label=Breadcrumb] landmark for screen readers.',
        'Last item has aria-current=page.',
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Docs', href: '/docs' },
            { label: 'Components' },
          ]}
        />
          </div>
        }
        code={"import { Breadcrumb } from '@slipstream-ui/core';\n\nexport default function Example() {\n  return (\n    <>\n      <Breadcrumb\n          items={[\n            { label: 'Home', href: '/' },\n            { label: 'Docs', href: '/docs' },\n            { label: 'Components' },\n          ]}\n        />\n    </>\n  );\n}"}
        usage={"import { Breadcrumb } from '@slipstream-ui/core';\n\n// Basic usage\n<Breadcrumb />"}
        types={"interface BreadcrumbProps {\n  items: BreadcrumbItem[];\n  separator: ReactNode;\n}"}
      />
    </ComponentPage>
  );
}
