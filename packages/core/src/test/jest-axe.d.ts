declare module 'jest-axe' {
  export interface AxeResult {
    violations: unknown[];
  }

  /**
   * Run axe-core against rendered HTML or an element.
   * Returns a promise compatible with the toHaveNoViolations matcher.
   */
  export function axe(html: string | Element): Promise<AxeResult>;

  /** Matcher extension object for expect(). */
  export const toHaveNoViolations: {
    toHaveNoViolations: () => { pass: boolean; message: () => string };
  };
}
