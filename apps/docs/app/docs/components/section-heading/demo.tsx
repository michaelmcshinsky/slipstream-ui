'use client';

import { Link, SectionHeading } from '@slipstream-ui/core';
import { ComponentPage } from '@/components/component-page';
import { DemoCard } from '@/components/demo-card';

export default function SectionHeadingPage() {
  return (
    <ComponentPage
      id="section-heading"
      title="SectionHeading"
      description="Section heading block: eyebrow, title (level 2–4), description and actions, with left/center alignment and three sizes."
      npmPackages="@slipstream-ui/core"
      propsRows={[
        { name: 'title', type: 'string', defaultValue: 'required', description: 'Section title.' },
        { name: 'description', type: 'string', description: 'Supporting copy.' },
        { name: 'eyebrow', type: 'ReactNode', description: 'Kicker above the title.' },
        { name: 'actions', type: 'ReactNode', description: 'Right-aligned actions.' },
        { name: 'level', type: '2 | 3 | 4', defaultValue: '2', description: 'Heading level rendered for the title.' },
        { name: 'align', type: "'left' | 'center'", defaultValue: "'left'", description: 'Text and action alignment.' },
        { name: 'size', type: "'sm' | 'md' | 'lg'", defaultValue: "'md'", description: 'Title scale.' },
      ]}
      accessibility={['Renders h2 by default (PageHeader owns the page h1).', 'Pass level={3} for nested subsections so the outline stays sequential.']}
    >
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
  description?: string;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  level?: 2 | 3 | 4;
  align?: 'left' | 'center';
  size?: 'sm' | 'md' | 'lg';
};`}
      />
    </ComponentPage>
  );
}
