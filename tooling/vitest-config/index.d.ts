import type { defineConfig as defineVitestConfig } from 'vitest/config';

export declare function createTestConfig(options?: {
  setupFiles?: string[];
}): ReturnType<typeof defineVitestConfig>;
export default createTestConfig;
