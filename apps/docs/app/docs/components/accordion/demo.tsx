import { DemoCard } from '@/components/demo-card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@slipstream-ui/core';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Full-width usage"
        preview={
          <div className="space-y-4">
            <Accordion defaultValue={['a']}>
              <AccordionItem id="a">
                <AccordionTrigger>What is Slipstream?</AccordionTrigger>
                <AccordionContent>
                  An AI-first component system with machine-readable manifests.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem id="b">
                <AccordionTrigger>How do I install?</AccordionTrigger>
                <AccordionContent>Run npx @slipstream-ui/cli@latest init in your project.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        }
        code={`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@slipstream-ui/core';

export default function Example() {
  return (
    // w-full root: the header stays clickable edge-to-edge in both states
    <Accordion defaultValue={['a']}>
      <AccordionItem id="a">
        <AccordionTrigger>What is Slipstream?</AccordionTrigger>
        <AccordionContent>An AI-first component system with machine-readable manifests.</AccordionContent>
      </AccordionItem>
      <AccordionItem id="b">
        <AccordionTrigger>How do I install?</AccordionTrigger>
        <AccordionContent>Run npx @slipstream-ui/cli@latest init in your project.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`}
        usage={`import { Accordion } from '@slipstream-ui/core';

// Uncontrolled with an initially open item
<Accordion defaultValue={['faq-1']}>…</Accordion>

// Controlled
<Accordion value={open} onValueChange={setOpen}>…</Accordion>`}
        types={`type AccordionProps = {
  value?: string[];
  defaultValue?: string[];
  collapsible?: boolean;
  onValueChange?: (value: string[]) => void;
};`}
      />

      <DemoCard
        title="Custom header icon"
        preview={
          <div className="space-y-4">
            <Accordion defaultValue={['plus']}>
              <AccordionItem id="plus">
                <AccordionTrigger
                  icon={
                    <span aria-hidden="true" className="font-mono text-sm text-primary">
                      [+]
                    </span>
                  }
                >
                  Rendered with a custom icon slot
                </AccordionTrigger>
                <AccordionContent>
                  The icon prop replaces the default chevron; the rotate-on-open behavior is yours to
                  define when you bring your own markup.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        }
        code={`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@slipstream-ui/core';

<Accordion>
    <AccordionItem id="x">
      <AccordionTrigger icon={<span className="font-mono text-sm text-primary">[+]</span>}>
        Rendered with a custom icon slot
      </AccordionTrigger>
      <AccordionContent>Panel content.</AccordionContent>
    </AccordionItem>
  </Accordion>`}
      />

      <DemoCard
        title="Borderless + gap"
        preview={
          <div className="w-full space-y-4">
            <Accordion variant="borderless" gap={16} defaultValue={['a']}>
              <AccordionItem id="a">
                <AccordionTrigger>Spaced sections, no chrome</AccordionTrigger>
                <AccordionContent>
                  variant=&quot;borderless&quot; removes the outer border and dividers; gap accepts
                  tokens (&apos;lg&apos;) or exact pixels (16).
                </AccordionContent>
              </AccordionItem>
              <AccordionItem id="b">
                <AccordionTrigger>Second section</AccordionTrigger>
                <AccordionContent>Exact pixel gaps keep spacing on your own scale.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        }
        code={`import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@slipstream-ui/core';

{/* Plain stacked sections with an exact 16px gap */}
<Accordion variant="borderless" gap={16} defaultValue={['a']}>
  <AccordionItem id="a">
    <AccordionTrigger>Spaced sections, no chrome</AccordionTrigger>
    <AccordionContent>…</AccordionContent>
  </AccordionItem>
  …
</Accordion>

{/* Token gap instead: gap="lg" */}
<Accordion variant="borderless" gap="lg">…</Accordion>`}
        usage={`// Default (bordered card with dividers): unchanged
<Accordion>…</Accordion>

// Variants combine: borderless + token spacing
<Accordion variant="borderless" gap="lg">…</Accordion>`}
        types={`type AccordionProps = {
  value?: string[];
  collapsible?: boolean;
  variant?: 'default' | 'borderless';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | number;
};`}
      />
    </>
  );
}
