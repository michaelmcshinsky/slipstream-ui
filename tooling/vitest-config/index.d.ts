import type { defineConfig as defineVitestConfig } from 'vitest/config';

export declare function createTestConfig(options?: {
  setupFiles?: string[];
  test?: Record<string, unknown>;
}): ReturnType<typeof defineVitestConfig>;
export default createTestConfig;
