import { createTestConfig } from '@slipstream-ui/vitest-config';

export default createTestConfig({
  setupFiles: ['./src/test/setup.ts'],
  // The AI suite renders many markdown/streaming trees. Two workers keep the
  // jsdom heaps bounded on CI and memory-constrained local machines.
  test: { maxWorkers: 2 },
});
