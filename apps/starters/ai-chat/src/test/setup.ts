import '@testing-library/jest-dom/vitest';
import * as jestAxe from 'jest-axe';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';

expect.extend(jestAxe.toHaveNoViolations);

afterEach(() => {
  cleanup();
});

if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = () =>
      ({
        matches: false,
        media: '',
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }) as MediaQueryList;
  }
  if (!('ResizeObserver' in window)) {
    class ResizeObserverMock {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    Object.defineProperty(window, 'ResizeObserver', { value: ResizeObserverMock });
  }
}

Element.prototype.scrollIntoView = Element.prototype.scrollIntoView ?? (() => undefined);
