import Link from 'next/link';
import { Navbar } from '@/components/site/navbar';
import { MobileNav } from '@/components/site/mobile-nav';
import { Footer } from '@/components/site/footer';

export type MarketingPageProps = {
  title: string;
  description?: string;
  updated?: string;
  children: React.ReactNode;
};

/** Shared shell for marketing/legal pages (privacy, terms, contact, thanks). */
export function MarketingPage({ title, description, updated, children }: MarketingPageProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="px-4 md:hidden">
        <MobileNav />
      </div>
      <main id="main" className="container mx-auto flex-1 px-4 py-12 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <p className="mb-3">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back to home
            </Link>
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          {description && <p className="mt-3 text-lg text-muted-foreground">{description}</p>}
          {updated && <p className="mt-2 text-xs uppercase tracking-wide text-muted-foreground">Last updated: {updated}</p>}
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted-foreground">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
