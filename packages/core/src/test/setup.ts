import '@testing-library/jest-dom/vitest';
import * as jestAxe from 'jest-axe';
import { cleanup } from '@testing-library/react';
import { afterEach, expect } from 'vitest';

expect.extend(jestAxe.toHaveNoViolations);

afterEach(() => {
  cleanup();
});
