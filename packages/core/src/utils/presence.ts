import * as React from 'react';

/**
 * Keeps overlay content mounted while an optional exit animation plays.
 *
 * `present` gates rendering: it stays true for `exitMs` after `open`
 * flips false (when `animate` is on), giving CSS exit classes a window
 * to run before the portal unmounts. `exiting` tells the component to
 * swap enter classes for exit classes during that window.
 */
export function usePresence(
  open: boolean,
  animate: boolean,
  exitMs = 200,
): { present: boolean; exiting: boolean } {
  const [present, setPresent] = React.useState(open);

  React.useEffect(() => {
    if (open) {
      setPresent(true);
      return;
    }
    if (!present) return;
    if (!animate) {
      setPresent(false);
      return;
    }
    const timer = setTimeout(() => setPresent(false), exitMs);
    return () => clearTimeout(timer);
  }, [open, animate, present, exitMs]);

  return { present, exiting: present && !open };
}
