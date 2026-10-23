import { CodeBlock } from '@/components/code-block';
import { Navbar } from '@/components/site/navbar';
import { MobileNav } from '@/components/site/mobile-nav';
import { Footer } from '@/components/site/footer';

const releases = [
  {
    version: '0.1.0-beta',
    date: 'August 2026',
    tag: 'current',
    highlights: [
      '21 components across @slipstream-ui/core and @slipstream-ui/ai, each shipping a COMPONENT_MANIFEST',
      'Response: streaming-safe GFM markdown renderer with automatic repair of incomplete syntax',
      'CodeBlock: syntax highlighting with copy button (prism-react-renderer)',
      'Confirmation: human-in-the-loop approval gate for agent actions',
      'Branch: message variant navigation; InlineCitation: hover citation chips',
      'Conversation: welcome/empty state, scroll-to-latest pill, transcript download, paginated history with scroll anchoring',
      'PromptInput: compound primitives, drag-and-drop + clipboard-paste attachments with constraints, dictation, status-aware submit control',
      'Message: error/retry card and edit-and-resubmit flow',
      'MCP server: list_components, get_component_manifest, get_usage_examples, validate_usage',
      'shadcn-compatible registry: npx shadcn add https://slipstreamui.com/registry/<id>.json',
      'jest-axe tested components; CI runs lint, typecheck, tests, builds, manifest validation',
    ],
  },
];

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* px-4 absorbs the pills bar's -mx-4 bleed so the page never scrolls horizontally. */}
      <div className="px-4">
        <MobileNav />
      </div>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-4xl font-bold mb-2">Changelog</h1>
        <p className="text-lg text-muted-foreground mb-10">
          Release notes for Slipstream UI. Versions follow semver.
        </p>

        {releases.map((release) => (
          <section key={release.version} className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-2xl font-semibold">{release.version}</h2>
              <span className="text-sm text-muted-foreground">{release.date}</span>
              {release.tag === 'current' && (
                <span className="text-xs px-2 py-0.5 rounded-full border border-primary/40 bg-primary/10 text-primary font-medium">
                  current
                </span>
              )}
            </div>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              {release.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </section>
        ))}

        <h2 className="text-2xl font-semibold mb-4">Install</h2>
        <CodeBlock>{`# Packages
pnpm add @slipstream-ui/core @slipstream-ui/ai

# Or install source copies via the shadcn-compatible registry
npx shadcn@latest add https://slipstreamui.com/registry/message.json`}</CodeBlock>
      </div>
      <Footer />
    </div>
  );
}
