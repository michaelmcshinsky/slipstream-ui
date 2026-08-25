import { Navbar } from '@/components/site/navbar';
import { Sidebar } from '@/components/site/sidebar';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="flex gap-10">
          <Sidebar />
          <main className="min-w-0 flex-1 py-8 lg:py-10">{children}</main>
        </div>
      </div>
    </>
  );
}
