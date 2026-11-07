/**
 * Normalize copied component source for comparison and installation.
 *
 * Components move from `src/components/<dir>` to the flat destination, so
 * `../../utils/*` and `../../types/*` become `../utils/*` and `../types/*`.
 * Line endings are normalized so a Windows checkout and a Linux CI checkout
 * compare equal.
 */
export function rewriteSupportImports(content: string): string {
  return content
    .replaceAll('../../utils/', '../utils/')
    .replaceAll('../../types/', '../types/');
}

export function normalizeSource(content: string): string {
  return rewriteSupportImports(content).replaceAll('\r\n', '\n');
}
