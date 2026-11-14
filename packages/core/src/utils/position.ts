export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Align = 'start' | 'center' | 'end';

export type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type Size = {
  width: number;
  height: number;
};

export type PositionOptions = {
  /** The element the panel is anchored to, in viewport coordinates. */
  anchor: Rect;
  /** Measured panel size. */
  content: Size;
  /** Viewport size (normally window.innerWidth/innerHeight). */
  viewport: Size;
  side?: Side;
  align?: Align;
  /** Distance between the anchor and the panel, along the side axis. */
  sideOffset?: number;
  /** Nudge along the cross axis. */
  alignOffset?: number;
  /** Minimum distance the panel keeps from the viewport edges. */
  collisionPadding?: number;
};

export type PositionResult = {
  top: number;
  left: number;
  /** The side actually used after collision handling. */
  side: Side;
};

const OPPOSITE: Record<Side, Side> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

const isHorizontal = (side: Side) => side === 'left' || side === 'right';

function clamp(value: number, min: number, max: number): number {
  if (max < min) return min;
  return Math.min(Math.max(value, min), max);
}

function spaceFor(side: Side, anchor: Rect, viewport: Size, padding: number): number {
  switch (side) {
    case 'top':
      return anchor.top - padding;
    case 'bottom':
      return viewport.height - (anchor.top + anchor.height) - padding;
    case 'left':
      return anchor.left - padding;
    case 'right':
      return viewport.width - (anchor.left + anchor.width) - padding;
  }
}

/**
 * Places a floating panel beside an anchor, flipping to the opposite side when
 * the preferred side has less room, then clamping to the viewport.
 *
 * Pure so the arithmetic can be tested without a DOM: the component only
 * measures and applies the result.
 */
export function computePosition({
  anchor,
  content,
  viewport,
  side = 'bottom',
  align = 'start',
  sideOffset = 8,
  alignOffset = 0,
  collisionPadding = 8,
}: PositionOptions): PositionResult {
  const crossExtent = isHorizontal(side) ? content.height : content.width;
  const mainExtent = isHorizontal(side) ? content.width : content.height;
  const vertical = !isHorizontal(side);

  const preferredSpace = spaceFor(side, anchor, viewport, collisionPadding);
  const oppositeSpace = spaceFor(OPPOSITE[side], anchor, viewport, collisionPadding);
  const resolvedSide =
    preferredSpace < mainExtent && oppositeSpace > preferredSpace ? OPPOSITE[side] : side;

  // Cross-axis offset from the anchor's leading edge.
  const anchorCrossStart = vertical ? anchor.left : anchor.top;
  const anchorCrossSize = vertical ? anchor.width : anchor.height;
  let cross =
    align === 'start'
      ? anchorCrossStart
      : align === 'end'
        ? anchorCrossStart + anchorCrossSize - crossExtent
        : anchorCrossStart + (anchorCrossSize - crossExtent) / 2;
  cross += alignOffset;

  // Main-axis offset from the anchor's edge.
  let main: number;
  switch (resolvedSide) {
    case 'bottom':
      main = anchor.top + anchor.height + sideOffset;
      break;
    case 'top':
      main = anchor.top - content.height - sideOffset;
      break;
    case 'right':
      main = anchor.left + anchor.width + sideOffset;
      break;
    default:
      main = anchor.left - content.width - sideOffset;
  }

  const crossLimit = (vertical ? viewport.width : viewport.height) - crossExtent - collisionPadding;
  const boundedCross = clamp(cross, collisionPadding, crossLimit);

  const mainLimit = (vertical ? viewport.height : viewport.width) - mainExtent - collisionPadding;
  const boundedMain = clamp(main, collisionPadding, mainLimit);

  return vertical
    ? { top: boundedMain, left: boundedCross, side: resolvedSide }
    : { top: boundedCross, left: boundedMain, side: resolvedSide };
}
