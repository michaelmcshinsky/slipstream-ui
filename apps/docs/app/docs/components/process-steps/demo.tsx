'use client';

import { ProcessSteps, Section } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Onboarding process"
        preview={
          <Section padding="lg" className="rounded-lg">
            <ProcessSteps
              steps={[
                { title: 'Meet your guide', description: 'Share your goals and timing with a product specialist.' },
                { title: 'Review recommendations', description: 'Compare options matched to your team and stage.' },
                { title: 'Choose and launch', description: 'Shortlist the option you like best and launch.' },
              ]}
            />
          </Section>
        }
        code={`<Section>
  <ProcessSteps
    steps={[
      { title: 'Meet your guide', description: 'Share your goals and timing.' },
      { title: 'Review recommendations', description: 'Compare matched options.' },
      { title: 'Choose and launch', description: 'Choose with confidence.' },
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
    </>
  );
}
