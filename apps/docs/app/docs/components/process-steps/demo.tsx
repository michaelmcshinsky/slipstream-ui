'use client';

import { ProcessSteps, Section } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function ProcessStepsPage() {
  return (
    <ComponentPage
      id="process-steps"
      title="ProcessSteps"
      description="Ordered process cards with derived step numbers or custom icons."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'steps', type: 'ProcessStep[]', defaultValue: 'required', description: 'Ordered steps: title, optional description and icon.' },
        { name: 'columns', type: '2 | 3 | 4', defaultValue: '3', description: 'Desktop column count.' },
        { name: 'numbered', type: 'boolean', defaultValue: 'true', description: 'Show step numbers when no icon is provided.' },
        { name: 'align', type: "'left' | 'center'", defaultValue: "'left'", description: 'Content alignment.' },
      ]}
      accessibility={[
        'Renders an ordered list, so the sequence is structural.',
        'Step numbers are derived from list order; do not hardcode them in titles.',
      ]}
    >
      <DemoCard
        title="Advisor process"
        preview={
          <Section padding="lg" className="rounded-lg">
            <ProcessSteps
              steps={[
                { title: 'Meet your consultant', description: 'Share your goals and timing with an Exit Consultant.' },
                { title: 'Review recommendations', description: 'Compare advisors matched to your business and sector.' },
                { title: 'Interview and hire', description: 'Shortlist and interview the advisors you like best.' },
              ]}
            />
          </Section>
        }
        code={`<Section>
  <ProcessSteps
    steps={[
      { title: 'Meet your consultant', description: 'Share your goals and timing.' },
      { title: 'Review recommendations', description: 'Compare matched advisors.' },
      { title: 'Interview and hire', description: 'Choose with confidence.' },
    ]}
  />
</Section>`}
        usage={`// Steps render as an ordered list; numbers come from the order.
// Pass icon to replace the number marker, or numbered={false} to hide it.`}
        types={`type ProcessStep = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
};

type ProcessStepsProps = {
  steps: ProcessStep[];
  columns?: 2 | 3 | 4;
  numbered?: boolean;
  align?: 'left' | 'center';
};`}
      />
    </ComponentPage>
  );
}
