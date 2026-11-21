import { createTestConfig } from '@slipstream-ui/vitest-config';

export default createTestConfig({
  setupFiles: [],
  // Node-only package: jsdom + the React plugin make fork workers exceed the
  // startup timeout without exercising anything the tests need.
  test: { environment: 'node' },
});
