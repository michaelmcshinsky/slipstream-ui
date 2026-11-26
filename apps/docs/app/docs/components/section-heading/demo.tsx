'use client';

import { Link, SectionHeading } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Marketing section"
        preview={
          <div className="w-full space-y-8">
            <SectionHeading
              eyebrow="Components"
              title="Built for agents"
              description="Every component ships a machine-readable spec, so your assistant writes correct UI the first time."
              actions={<Link href="/docs/components" variant="arrow">Browse all →</Link>}
            />
            <SectionHeading
              title="Centered variant"
              description="Use align=center for hero-adjacent sections."
              align="center"
              size="lg"
            />
          </div>
        }
        code={`<SectionHeading
  eyebrow="Components"
  title="Built for agents"
  description="Every component ships a machine-readable spec."
  actions={<Link href="/docs/components" variant="arrow">Browse all →</Link>}
/>

<SectionHeading title="Centered variant" align="center" size="lg" description="…" />`}
        usage={`// Sections use SectionHeading (h2+); the page itself uses PageHeader (h1).
// size sm|md|lg controls the title scale; level 2|3|4 controls semantics.`}
        types={`type SectionHeadingProps = {
  title: string;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  level?: 2 | 3 | 4;
  align?: 'left' | 'center';
  size?: 'sm' | 'md' | 'lg';
  titleClassName?: string;
  descriptionClassName?: string;
  eyebrowClassName?: string;
};`}
      />
    </>
  );
}
