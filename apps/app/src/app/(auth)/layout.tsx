export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/30 px-4">
      <a href="/" className="text-xl font-bold tracking-tight">
        Slipstream<span className="text-primary">UI</span>
      </a>
      {children}
    </main>
  );
}
