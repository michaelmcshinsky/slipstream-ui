'use client';

import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/analytics';
import { buildAiInstruction, type RegistryManifest } from '@/lib/copy-for-ai';

/**
 * "Copy for AI": fetches the component's registry payload on demand so the
 * docs page does not ship every manifest in its JS bundle.
 */
export function CopyForAi({ componentId }: { componentId: string }) {
  const [state, setState] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  async function copy() {
    setState('copying');
    try {
      const response = await fetch(`/registry/${componentId}.json`);
      if (!response.ok) throw new Error(`Registry payload unavailable (${response.status})`);
      const manifest = (await response.json()) as RegistryManifest;
      await navigator.clipboard.writeText(buildAiInstruction(manifest, componentId));
      track('copy_for_ai', { component: componentId });
      setState('copied');
      timer.current = setTimeout(() => setState('idle'), 2500);
    } catch {
      setState('error');
      timer.current = setTimeout(() => setState('idle'), 4000);
    }
  }

  const label =
    state === 'copied'
      ? 'Copied for AI'
      : state === 'copying'
        ? 'Building instruction…'
        : state === 'error'
          ? 'Copy failed: try again'
          : 'Copy for AI';

  return (
    <button
      type="button"
      onClick={copy}
      disabled={state === 'copying'}
      title="Copy a version-specific instruction with props, examples and constraints for your coding agent"
      className="mt-1.5 inline-flex h-7 items-center gap-1.5 rounded-md border border-primary/40 bg-primary/5 px-2.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-70"
    >
      <span aria-hidden="true">✦</span>
      <span aria-live="polite">{label}</span>
    </button>
  );
}
