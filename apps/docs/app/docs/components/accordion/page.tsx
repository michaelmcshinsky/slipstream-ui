import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@slipstream-ui/core';

export default function AccordionPage() {
  return (
    <ComponentPage
      id="accordion"
      title="Accordion"
      description="Collapsible content sections with ARIA accordion semantics."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'value', type: 'string[]', description: 'Controlled open item ids.' },
        { name: 'collapsible', type: 'boolean', defaultValue: 'true', description: 'When true, opening an item closes the others.' },
        { name: 'onValueChange', type: '(value: string[]) => void', description: 'Called when the open set changes.' },
      ]}
      accessibility={[
        'Trigger has aria-expanded and aria-controls; panel has role=region.',
        'Hidden panels are removed from the tab order.',
      ]}
    >
      <DemoCard
        title="Usage"
        preview={
          <div className="space-y-4">
            <Accordion defaultValue={['a']} className="max-w-md">
          <AccordionItem id="a">
            <AccordionTrigger>What is Slipstream?</AccordionTrigger>
            <AccordionContent>An AI-first component system with machine-readable manifests.</AccordionContent>
          </AccordionItem>
          <AccordionItem id="b">
            <AccordionTrigger>How do I install?</AccordionTrigger>
            <AccordionContent>Run npx slipstream-ui init in your project.</AccordionContent>
          </AccordionItem>
        </Accordion>
          </div>
        }
        code="// See the examples in the props table above"
      />
    </ComponentPage>
  );
}
