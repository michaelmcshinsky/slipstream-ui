import type { Metadata } from 'next';
import Demo from './demo';

export const metadata: Metadata = {
  title: "CommandPalette",
  description: "Cmd+K style command palette with lexical search, sectioned results and full keyboard navigation.",
};

export default function Page() {
  return <Demo />;
}
