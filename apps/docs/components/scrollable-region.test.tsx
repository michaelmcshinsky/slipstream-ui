import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ScrollablePre, ScrollableRegion } from './scrollable-region';

// react-dom/client act() requires this flag outside the React test renderer.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

function render(node: React.ReactElement) {
  act(() => root.render(node));
}

/** jsdom reports 0 for both metrics; force an overflowing box. */
function forceOverflow(element: HTMLElement, scrollWidth: number, clientWidth: number) {
  Object.defineProperty(element, 'scrollWidth', { value: scrollWidth, configurable: true });
  Object.defineProperty(element, 'clientWidth', { value: clientWidth, configurable: true });
}

function resize() {
  act(() => {
    window.dispatchEvent(new Event('resize'));
  });
}

describe('ScrollablePre', () => {
  it('renders a pre without a tab stop when content fits', () => {
    render(<ScrollablePre className="overflow-x-auto"><code>short</code></ScrollablePre>);
    const pre = container.querySelector('pre');
    expect(pre).not.toBeNull();
    expect(pre?.textContent).toBe('short');
    expect(pre?.getAttribute('tabindex')).toBeNull();
    expect(pre?.getAttribute('aria-label')).toBeNull();
  });

  it('becomes keyboard-focusable only when the content overflows', () => {
    render(
      <ScrollablePre className="overflow-x-auto">
        <code>{'x'.repeat(500)}</code>
      </ScrollablePre>
    );
    const pre = container.querySelector('pre') as HTMLElement;
    forceOverflow(pre, 500, 100);
    resize();
    expect(pre.getAttribute('tabindex')).toBe('0');
    expect(pre.getAttribute('aria-label')).toBe('Code block, scrollable');
  });
});

describe('ScrollableRegion', () => {
  it('labels the region only while it is scrollable', () => {
    render(
      <ScrollableRegion label="Table" className="overflow-x-auto">
        <table />
      </ScrollableRegion>
    );
    const region = container.querySelector('div') as HTMLElement;
    expect(region.getAttribute('tabindex')).toBeNull();

    forceOverflow(region, 500, 100);
    resize();
    expect(region.getAttribute('tabindex')).toBe('0');
    expect(region.getAttribute('aria-label')).toBe('Table, scrollable');
  });
});
