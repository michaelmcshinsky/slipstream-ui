import { Navbar } from '@/components/site/navbar';
import { Sidebar } from '@/components/site/sidebar';
import { MobileNav } from '@/components/site/mobile-nav';
import { PageFeedback } from '@/components/site/page-feedback';
import { TableOfContents } from '@/components/table-of-contents';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {/* Full-width docs shell (no container cap); the content column below
          is what gets centered and width-limited for reading. */}
      <div className="w-full px-4 sm:px-6">
        <div className="flex gap-8 xl:gap-10">
          <Sidebar />
          <main id="main" className="min-w-0 flex-1 py-8 lg:py-10">
            <MobileNav />
            {/* Centered reading column inside the full-width shell. */}
            <div className="mx-auto mt-4 w-full max-w-4xl lg:mt-0">
              {children}
              <PageFeedback />
            </div>
          </main>
          <TableOfContents />
        </div>
      </div>
    </>
  );
}
