import * as React from 'react';

/**
 * Module-level stack of open modal layers.
 *
 * Dialog and Drawer share this stack so nested modals close one at a time and
 * the body scroll lock is released only after the last layer closes.
 */
const layers: symbol[] = [];
let restoreScroll: (() => void) | null = null;

export function useModalLayer(open: boolean) {
  const id = React.useRef(Symbol('modal-layer'));

  React.useEffect(() => {
    const layerId = id.current;
    if (!open) return;
    layers.push(layerId);

    if (layers.length === 1) {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      restoreScroll = () => {
        document.body.style.overflow = previousOverflow;
      };
    }

    return () => {
      const index = layers.indexOf(layerId);
      if (index >= 0) layers.splice(index, 1);
      if (layers.length === 0) {
        restoreScroll?.();
        restoreScroll = null;
      }
    };
  }, [open]);

  return React.useCallback(() => layers[layers.length - 1] === id.current, []);
}

/** Test-only helper: number of currently registered modal layers. */
export function openModalLayerCount() {
  return layers.length;
}
