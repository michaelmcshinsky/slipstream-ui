'use client';

import { ContactStrip, Section } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Contact details"
        preview={
          <Section tone="muted" padding="lg" className="rounded-lg">
            <ContactStrip
              items={[
                { label: 'Call', value: '+1 555 0100', href: 'tel:+15550100' },
                { label: 'Email', value: 'hello@example.com', href: 'mailto:hello@example.com' },
                { label: 'Visit', value: '100 Example Street, Springfield' },
              ]}
            />
          </Section>
        }
        code={`<ContactStrip
  items={[
    { label: 'Call', value: '+1 555 0100', href: 'tel:+15550100' },
    { label: 'Email', value: 'hello@example.com', href: 'mailto:hello@example.com' },
    { label: 'Visit', value: '100 Example Street, Springfield' },
  ]}
/>`}
        usage={`// Labels name the channel, values carry the detail.
// Provide tel: and mailto: hrefs when the value is actionable.`}
        types={`type ContactItem = {
  label: string;
  value: string;
  href?: string;
  icon?: React.ReactNode;
};

type ContactStripProps = {
  items: ContactItem[];
  columns?: 2 | 3;
  align?: 'left' | 'center';
  linkComponent?: React.ElementType;
};`}
      />
      <DemoCard
        title="Three columns, centered"
        preview={
          <Section tone="muted" padding="lg" className="rounded-lg">
            <ContactStrip
              columns={3}
              align="center"
              items={[
                { label: 'Call', value: '+1 555 0100', href: 'tel:+15550100' },
                { label: 'Email', value: 'hello@example.com', href: 'mailto:hello@example.com' },
                { label: 'Visit', value: '100 Example Street, Springfield' },
              ]}
            />
          </Section>
        }
        code={`<ContactStrip
  columns={3}
  align="center"
  items={[...]}
/>`}
        usage={`// columns={3} + align="center" suits footer contact bands;
// keep 2 columns for inline detail rows.`}
      />
    </>
  );
}
