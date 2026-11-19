import { defineConfig, devices } from '@playwright/test';

/**
 * Visual regression for the shell chrome. The fixture is an isolated Vite app
 * that consumes the built packages, so a layout regression in AppShell or
 * SiteHeader fails here instead of in a consumer's product.
 *
 * Update baselines (review the diff before committing):
 *   pnpm test:visual:update
 */
export default defineConfig({
  testDir: './tests/visual',
  snapshotDir: './tests/visual/__screenshots__',
  snapshotPathTemplate: '{snapshotDir}/{testFilePath}/{arg}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
    },
  },
  use: {
    baseURL: 'http://127.0.0.1:4180',
    trace: 'off',
    colorScheme: 'light',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
  ],
  webServer: {
    command: 'pnpm --filter @slipstream-ui/visual dev',
    url: 'http://127.0.0.1:4180',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
