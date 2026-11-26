'use client';

import { ArticleCard, Grid, Section } from '@slipstream-ui/core';
import { DemoCard } from '@/components/demo-card';

export default function Demo() {
  return (
    <>
      <DemoCard
        title="Resource grid"
        preview={
          <Section padding="lg" className="rounded-lg">
            <Grid mdCols={2} gap="lg">
              <ArticleCard
                href="/articles/validation-benchmark-100-cases"
                eyebrow="Guides"
                title="How to plan a migration"
                description="A practical guide to planning the work and the first steps of a migration."
                meta="8 min read"
                media={<div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5" />}
              />
              <ArticleCard
                href="/articles/component-contract-not-gallery"
                eyebrow="Comparison"
                title="What teams look for"
                description="The signals that shape a platform decision."
                meta="6 min read"
                media={<div className="h-full w-full bg-gradient-to-br from-info/20 to-info/5" />}
              />
            </Grid>
          </Section>
        }
        code={`<Grid mdCols={2} gap="lg">
  <ArticleCard
    href="/articles/validation-benchmark-100-cases"
    eyebrow="Guides"
    title="How to plan a migration"
    description="A practical guide to planning the work and the first steps."
    meta="8 min read"
    media={<div className="h-full w-full bg-gradient-to-br from-primary/20 to-primary/5" />}
  />
</Grid>`}
        usage={`// The whole card is a link. Keep actions outside the card.
// media is a slot; use next/image, a plain img or an illustration.
// variant="compact" drops the media block for dense lists and sidebars.`}
        types={`type ArticleCardProps = {
  title: string;
  description?: string;
  href: string;
  eyebrow?: string;
  media?: React.ReactNode;
  meta?: React.ReactNode;
  linkComponent?: React.ElementType;
  variant?: 'default' | 'compact';
};`}
      />
      <DemoCard
        title="Compact variant"
        preview={
          <div className="w-full max-w-md space-y-2">
            <ArticleCard
              variant="compact"
              href="/articles/validation-benchmark-100-cases"
              eyebrow="Guides"
              title="How to plan a migration"
              meta="8 min read"
            />
            <ArticleCard
              variant="compact"
              href="/articles/component-contract-not-gallery"
              eyebrow="Comparison"
              title="What teams look for"
              meta="6 min read"
            />
          </div>
        }
        code={`<ArticleCard
  variant="compact"
  href="/articles/validation-benchmark-100-cases"
  eyebrow="Guides"
  title="How to plan a migration"
  meta="8 min read"
/>`}
        usage={`// Compact cards omit the media block — use them in sidebars,
// related-article rails and dense index lists.`}
      />
    </>
  );
}
