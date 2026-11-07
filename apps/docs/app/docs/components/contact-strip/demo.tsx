'use client';

import { ContactStrip, Section } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function ContactStripPage() {
  return (
    <ComponentPage
      id="contact-strip"
      title="ContactStrip"
      description="Compact labelled contact rows with optional icons and links."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'items', type: 'ContactItem[]', defaultValue: 'required', description: 'Contact rows: label, value, optional href and icon.' },
        { name: 'columns', type: '2 | 3', defaultValue: '2', description: 'Desktop column count.' },
        { name: 'align', type: "'left' | 'center'", defaultValue: "'left'", description: 'Row alignment.' },
        { name: 'linkComponent', type: 'React.ElementType', description: 'Custom link element for routers.' },
      ]}
      accessibility={[
        'Renders a list with one label and value per contact row.',
        'Phone and email links use tel: and mailto: destinations.',
      ]}
    >
      <DemoCard
        title="Contact details"
        preview={
          <Section tone="muted" padding="lg" className="rounded-lg">
            <ContactStrip
              items={[
                { label: 'Call', value: '1.800.860.4519', href: 'tel:18008604519' },
                { label: 'Email', value: 'info@axial.net', href: 'mailto:info@axial.net' },
                { label: 'Visit', value: '443 Park Avenue S, New York, NY 10016' },
              ]}
            />
          </Section>
        }
        code={`<ContactStrip
  items={[
    { label: 'Call', value: '1.800.860.4519', href: 'tel:18008604519' },
    { label: 'Email', value: 'info@axial.net', href: 'mailto:info@axial.net' },
    { label: 'Visit', value: '443 Park Avenue S, New York, NY 10016' },
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
    </ComponentPage>
  );
}
