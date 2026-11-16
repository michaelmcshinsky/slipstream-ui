import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { resolveLocale } from '@slipstream-ui/i18n';
import { getChangelogUi } from '@/lib/changelog-i18n';
import { CodeBlock } from '@slipstream-ui/ai';
import { Navbar } from '@/components/site/navbar';
import { MobileNav } from '@/components/site/mobile-nav';
import { Footer } from '@/components/site/footer';
import { JsonLd } from '@/components/site/json-ld';
import { withSeo } from '@/lib/seo';
import { articleSchema } from '@/lib/structured-data';

import { LATEST_RELEASE, RELEASES } from '@/lib/releases';
import { RELEASE } from '@/lib/release';

export const metadata: Metadata = withSeo('/changelog', {
  title: 'Changelog',
  description: `Release notes for Slipstream UI: new components, breaking changes, and migration notes for every version, following semver. Latest: ${LATEST_RELEASE.version}.`,
});

export default async function ChangelogPage() {
  const locale = resolveLocale((await cookies()).get('slipstream-locale')?.value);
  const ui = getChangelogUi(locale);
  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={articleSchema({
          headline: 'Slipstream UI changelog',
          description:
            `Release notes for Slipstream UI: new components, breaking changes, and migration notes for every version, following semver. Latest: ${LATEST_RELEASE.version}.`,
          path: '/changelog',
          dateModified: RELEASE.releaseDate,
        })}
      />
      <Navbar />
      {/* px-4 absorbs the pills bar's -mx-4 bleed so the page never scrolls horizontally. */}
      <div className="px-4">
        <MobileNav />
      </div>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-2">{ui.title}</h1>
        <p className="text-lg text-muted-foreground mb-10">
          {ui.intro}
        </p>

        {RELEASES.map((release) => {
          const isCurrent = release.tag === 'current';
          const highlights = release.version === '0.5.0' ? ui.release05 : release.highlights;
          const date = release.version === '0.5.0' ? ui.date05 : release.date;
          return (
            <section key={release.version} className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-2xl font-semibold">{release.version}</h2>
                <span className="text-sm text-muted-foreground">{date}</span>
                {isCurrent && (
                  <span className="text-xs px-2 py-0.5 rounded-full border border-primary/40 bg-primary/10 text-primary font-medium">
                    {ui.current}
                  </span>
                )}
              </div>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                {highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </section>
          );
        })}

        {locale !== 'en' && (
          <p className="mb-10 text-sm text-muted-foreground">{ui.archiveNote}</p>
        )}

        <h2 className="text-2xl font-semibold mb-4">{ui.installHeading}</h2>
        <CodeBlock
          language="bash"
          code={`# Packages
pnpm add @slipstream-ui/core @slipstream-ui/ai

# Or install source copies via the shadcn-compatible registry
npx shadcn@latest add https://slipstreamui.com/registry/message.json`}
        />
      </div>
      <Footer />
    </div>
  );
}
