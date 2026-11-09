declare module 'jest-axe' {
  export interface AxeResult {
    violations: unknown[];
  }

  type AxeOptions = Record<string, unknown>;

  /**
   * Run axe-core against rendered HTML or an element.
   * Returns a promise compatible with the toHaveNoViolations matcher.
   */
  export function axe(html: string | Element, options?: AxeOptions): Promise<AxeResult>;

  /** Create an axe instance with default runner options, e.g. disabled rules. */
  export function configureAxe(options?: AxeOptions): typeof axe;

  /** Matcher extension object for expect(). */
  export const toHaveNoViolations: {
    toHaveNoViolations: () => { pass: boolean; message: () => string };
  };
}
