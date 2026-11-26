import type { Metadata } from 'next';
import { Navbar } from '@/components/site/navbar';
import { MobileNav } from '@/components/site/mobile-nav';
import { Footer } from '@/components/site/footer';
import { Playground } from '@/components/site/playground';
import { JsonLd } from '@/components/site/json-ld';
import { webPageSchema } from '@/lib/structured-data';
import { withSeo } from '@/lib/seo';

const description =
  'Try a curated set of Slipstream UI components in the browser: change props, switch the preview width, copy the JSX, copy the install command, or copy a versioned instruction for your coding agent.';

export const metadata: Metadata = withSeo('/playground', {
  title: 'React component playground',
  description,
});

export default function PlaygroundPage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd
        data={webPageSchema({
          type: 'WebPage',
          name: 'React component playground',
          description,
          path: '/playground',
        })}
      />
      <Navbar />
      <div className="px-4">
        <MobileNav />
      </div>
      <main id="main">
        <Playground />
      </main>
      <Footer />
    </div>
  );
}
