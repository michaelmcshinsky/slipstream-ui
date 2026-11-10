import type { Metadata } from 'next';
import Demo from './demo';
import { withSeo } from '@/lib/seo';

export const metadata: Metadata = withSeo('/docs/components/command-palette', {
  title: "CommandPalette",
  description: "Cmd+K style command palette with lexical search, sectioned results and full keyboard navigation.",
});

export default function Page() {
  return <Demo />;
}
