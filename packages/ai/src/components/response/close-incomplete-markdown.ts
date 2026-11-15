/**
 * Repairs markdown that is mid-stream: closes unclosed bold/italic/strikethrough
 * markers and unterminated inline code / code fences so partial chunks render
 * without flickering or broken syntax.
 *
 * Deliberately conservative — only appends closing characters, never rewrites content.
 */
export function closeIncompleteMarkdown(markdown: string): string {
  let text = markdown;

  // Close an unterminated fenced code block (odd number of ``` lines).
  const fenceMatches = text.match(/^`{3,}/gm);
  if (fenceMatches && fenceMatches.length % 2 === 1) {
    text = `${text}\n\`\`\``;
  }

  // Inline constructs are only repaired outside of code fences for simplicity:
  // if we just opened a fence, the remainder is code and should not be touched.
  const firstFence = text.indexOf('```');
  const hasUnclosedFence = fenceMatches !== null && fenceMatches.length % 2 === 1;
  const prose = hasUnclosedFence && firstFence !== -1 ? text.slice(0, firstFence) : text;
  const rest = hasUnclosedFence && firstFence !== -1 ? text.slice(firstFence) : '';

  let repaired = prose;
  // Identifiers are not emphasis. `snake_case` and `my_func` are extremely
  // common in streamed text (and in inline code), so complete code spans are
  // dropped before counting and intraword underscores are ignored. Appending a
  // closer for those would corrupt the text instead of repairing it.
  const countable = prose.replace(/`[^`\n]*`/g, '');
  // Count unescaped emphasis markers; close whichever are odd.
  for (const marker of ['**', '__', '~~']) {
    const occurrences = countable.split(marker).length - 1;
    if (occurrences % 2 === 1) {
      repaired += marker;
    }
  }
  // Single asterisk/underscore italics.
  for (const marker of ['*', '_']) {
    // Only count markers not part of **/__ pairs by stripping doubles first.
    let singles = countable.replace(/\*\*/g, '').replace(/__/g, '');
    if (marker === '_') singles = singles.replace(/(?<=\w)_(?=\w)/g, '');
    if ((singles.split(marker).length - 1) % 2 === 1) {
      repaired += marker;
    }
  }
  // Inline code.
  const backtickCount = repaired.replace(/```/g, '').split('`').length - 1;
  if (backtickCount % 2 === 1) {
    repaired += '`';
  }

  return repaired + rest;
}
