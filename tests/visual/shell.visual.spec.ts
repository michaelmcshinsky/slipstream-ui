import { expect, test, type Page } from '@playwright/test';

const FIXTURE = 'http://127.0.0.1:4180';

async function gotoFixture(page: Page, query: string) {
  await page.goto(`${FIXTURE}/?${query}`);
  await page.waitForLoadState('networkidle');
}

test.describe('AppShell', () => {
  test('keeps the rail inside the viewport and the footer reachable (light)', async ({ page }) => {
    await gotoFixture(page, 'fixture=shell&theme=light');

    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav).toBeVisible();

    const rail = await nav.boundingBox();
    const viewport = page.viewportSize();
    expect(rail).not.toBeNull();
    expect(viewport).not.toBeNull();
    // The regression this suite exists for: a rail that stretches to the page height.
    expect(rail!.height).toBeLessThanOrEqual(viewport!.height + 1);

    await page.getByTestId('page-footer').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('page-footer')).toBeInViewport();

    await expect(page).toHaveScreenshot('appshell-desktop-light.png');
  });

  test('renders the same shell in dark mode', async ({ page }) => {
    await gotoFixture(page, 'fixture=shell&theme=dark');
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    await expect(page).toHaveScreenshot('appshell-desktop-dark.png');
  });

  test('collapses to an icon rail', async ({ page }) => {
    await gotoFixture(page, 'fixture=shell&theme=light&collapsed=1');

    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav).toBeVisible();
    const rail = await nav.boundingBox();
    expect(rail!.width).toBeLessThanOrEqual(96);

    // The long page is still reachable while the rail stays narrow.
    await page.getByTestId('page-footer').scrollIntoViewIfNeeded();
    await expect(page.getByTestId('page-footer')).toBeInViewport();

    await expect(page).toHaveScreenshot('appshell-collapsed-light.png');
  });

  test('opens navigation in the mobile drawer', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoFixture(page, 'fixture=shell&theme=light');

    // The desktop landmark is hidden below the breakpoint.
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeHidden();

    await page.getByRole('button', { name: 'Open navigation' }).click();
    const drawerNav = page.getByRole('navigation', { name: 'Primary' });
    await expect(drawerNav).toBeVisible();
    await expect(drawerNav.getByRole('link', { name: /Clients/ })).toBeVisible();
    expect(await page.evaluate(() => window.innerWidth)).toBe(390);

    await expect(page).toHaveScreenshot('appshell-mobile-drawer.png');
  });
});

test.describe('SiteHeader', () => {
  test('shows the desktop navigation landmark (light)', async ({ page }) => {
    await gotoFixture(page, 'fixture=header&theme=light');

    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Docs' })).toHaveAttribute('aria-current', 'page');

    await expect(page).toHaveScreenshot('siteheader-desktop-light.png');
  });

  test('renders in dark mode', async ({ page }) => {
    await gotoFixture(page, 'fixture=header&theme=dark');
    await expect(page.locator('html')).toHaveClass(/dark/);
    await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
    await expect(page).toHaveScreenshot('siteheader-desktop-dark.png');
  });

  test('moves navigation into the mobile drawer at 390', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await gotoFixture(page, 'fixture=header&theme=light');

    // The landmark stays (it wraps the bar), but the desktop item list collapses.
    await expect(
      page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'Docs' })
    ).toBeHidden();

    await page.getByRole('button', { name: 'Open menu' }).click();
    await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeVisible();

    await expect(page).toHaveScreenshot('siteheader-mobile.png');
  });
});
