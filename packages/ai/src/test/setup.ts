import '@testing-library/jest-dom/vitest';
import * as jestAxe from 'jest-axe';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, expect, vi } from 'vitest';

expect.extend(jestAxe.toHaveNoViolations);

// jsdom does not implement scroll layout APIs used by auto-scrolling components.
beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
});
