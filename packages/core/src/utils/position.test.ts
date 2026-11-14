import { describe, expect, it } from 'vitest';
import { computePosition, type Rect } from './position';

const anchor: Rect = { top: 200, left: 100, width: 120, height: 36 };
const content = { width: 288, height: 180 };
const viewport = { width: 1024, height: 768 };

describe('computePosition', () => {
  it('places the panel below the anchor by default', () => {
    const result = computePosition({ anchor, content, viewport });
    expect(result).toEqual({ top: 244, left: 100, side: 'bottom' });
  });

  it('honours sideOffset and alignOffset', () => {
    const result = computePosition({
      anchor,
      content,
      viewport,
      sideOffset: 12,
      alignOffset: -6,
    });
    expect(result.top).toBe(248);
    expect(result.left).toBe(94);
  });

  it('supports every side', () => {
    expect(computePosition({ anchor, content, viewport, side: 'top' })).toMatchObject({
      top: 12,
      side: 'top',
    });
    expect(computePosition({ anchor, content, viewport, side: 'right' })).toMatchObject({
      left: 228,
      side: 'right',
    });
    // Room on both sides, so the preferred side survives.
    expect(
      computePosition({ anchor: { ...anchor, left: 600 }, content, viewport, side: 'left' })
    ).toMatchObject({ left: 304, side: 'left' });
  });

  it('aligns start, center and end on the cross axis', () => {
    expect(computePosition({ anchor, content, viewport, align: 'start' }).left).toBe(100);
    expect(computePosition({ anchor, content, viewport, align: 'center' }).left).toBe(16);
    expect(computePosition({ anchor, content, viewport, align: 'end' }).left).toBe(8);
  });

  it('flips above when there is no room below', () => {
    const low = { ...anchor, top: 700 };
    const result = computePosition({ anchor: low, content, viewport });
    expect(result.side).toBe('top');
    expect(result.top).toBe(700 - 180 - 8);
  });

  it('flips left when there is no room on the right', () => {
    const wide = { ...anchor, left: 900 };
    const result = computePosition({ anchor: wide, content, viewport, side: 'right' });
    expect(result.side).toBe('left');
    expect(result.left).toBe(900 - 288 - 8);
  });

  it('keeps the preferred side when neither side fits', () => {
    const result = computePosition({
      anchor: { top: 40, left: 100, width: 20, height: 20 },
      content,
      viewport: { width: 300, height: 100 },
    });
    expect(result.side).toBe('bottom');
    expect(result.top).toBe(8);
  });

  it('clamps to collision padding on both axes', () => {
    const corner = { top: 760, left: 1000, width: 20, height: 20 };
    const result = computePosition({ anchor: corner, content, viewport, collisionPadding: 16 });
    expect(result.left).toBe(1024 - 288 - 16);
    expect(result.top).toBeGreaterThanOrEqual(16);
  });

  it('honours a larger collision padding on the cross axis', () => {
    const result = computePosition({
      anchor,
      content: { width: 1000, height: 180 },
      viewport,
      collisionPadding: 24,
    });
    expect(result.left).toBe(24);
  });

  it('never returns a negative offset when the panel is wider than the viewport', () => {
    const result = computePosition({
      anchor,
      content: { width: 1200, height: 180 },
      viewport,
    });
    expect(result.left).toBe(8);
  });

  it('centres a panel that is taller than the viewport', () => {
    const result = computePosition({
      anchor,
      content: { width: 200, height: 900 },
      viewport,
    });
    expect(result.top).toBe(8);
  });
});
