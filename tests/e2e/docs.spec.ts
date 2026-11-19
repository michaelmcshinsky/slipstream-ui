import { expect, test } from '@playwright/test';

test.describe('homepage conversion surface', () => {
  test('shows the install sequence, free scope, benchmark and FAQ', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Start building in minutes' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'What is free' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Questions developers ask first' })).toBeVisible();
    await expect(page.getByText('65.7% structural recall').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Benchmark methodology' }).first()).toBeVisible();
    await expect(page.getByText('6 tools incl. validate_usage')).toBeVisible();

    const jsonLd = (await page.locator('script[type="application/ld+json"]').allTextContents()).join('\n');
    expect(jsonLd).toContain('FAQPage');
    expect(jsonLd).toContain('Is Slipstream UI free?');
    expect(jsonLd).toContain('SoftwareApplication');
  });

  test('copies the canonical install command', async ({ page }) => {
    await page.goto('/');
    const install = page.getByRole('button', { name: /npx @slipstream-ui\/cli@latest init/ }).first();
    await install.click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(
      'npx @slipstream-ui/cli@latest init'
    );
  });
});

test.describe('component playground', () => {
  test('updates props, copies JSX and copies a versioned AI instruction', async ({ page }) => {
    await page.goto('/playground');
    await expect(page.getByRole('heading', { name: 'Try the components before you install' })).toBeVisible();

    await page.getByRole('button', { name: 'Badge' }).click();
    await page.getByLabel('variant').selectOption('destructive');

    const code = page.locator('pre').last();
    await expect(code).toContainText('<Badge variant="destructive"');

    await page.getByRole('button', { name: /Copy JSX/ }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(
      '<Badge variant="destructive"'
    );

    await page.getByRole('button', { name: /Copy for AI/ }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()), { timeout: 10_000 }).toContain(
      'manifest schema v1'
    );
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain(
      'https://slipstreamui.com/docs/components/badge'
    );

    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(code).toContainText('<Badge variant="success"');
  });

  test('the switch is interactive and mirrored in the code preview', async ({ page }) => {
    await page.goto('/playground');
    await page
      .getByRole('navigation', { name: 'Playground components' })
      .getByRole('button', { name: 'Switch', exact: true })
      .click();

    const previewSwitch = page.getByRole('switch', { name: 'Email notifications' });
    await expect(previewSwitch).toHaveAttribute('aria-checked', 'true');
    await previewSwitch.click();
    await expect(previewSwitch).toHaveAttribute('aria-checked', 'false');
    await expect(page.locator('pre').last()).toContainText('checked={false}');
  });

  test('changes the preview viewport', async ({ page }) => {
    await page.goto('/playground');
    await page.getByRole('button', { name: '375 px' }).click();
    await expect(page.getByRole('button', { name: '375 px' })).toHaveAttribute('aria-pressed', 'true');
  });
});

test.describe('component catalog', () => {
  test('filters by free text and category', async ({ page }) => {
    await page.goto('/docs/components');

    const filter = page.getByLabel('Find a component');
    await filter.fill('streaming');
    await expect(page.locator('main#main').getByRole('link', { name: /StreamingIndicator/ })).toBeVisible();
    await expect(page.getByText(/matching “streaming”/)).toBeVisible();

    await filter.fill('zzz-no-such-component');
    await expect(page.getByText('No component matches that search.')).toBeVisible();

    await filter.clear();
    await page
      .getByRole('group', { name: 'Filter by category' })
      .getByRole('button', { name: 'AI chat' })
      .click();
    await expect(page.locator('main#main').getByRole('link', { name: /Conversation/ })).toBeVisible();
    await expect(page.locator('main#main').getByRole('link', { name: /Accordion/ })).toHaveCount(0);
  });
});

test.describe('component reference', () => {
  test('exposes dependencies and a working Copy for AI action', async ({ page }) => {
    await page.goto('/docs/components/button');

    await expect(page.getByRole('heading', { name: 'Dependencies' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText('@radix-ui/react-slot')).toBeVisible();

    await page.getByRole('button', { name: /Copy for AI/ }).click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()), { timeout: 10_000 }).toContain(
      'Slipstream UI — Button'
    );
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('manifest schema v1');
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('## Required props');
  });

  test('has the maintenance links', async ({ page }) => {
    await page.goto('/docs/components/button');
    await expect(page.getByRole('link', { name: 'Edit this page on GitHub' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Report an accessibility issue' })).toBeVisible();
  });
});

test.describe('privacy preferences', () => {
  test('declines, resets and restores the banner', async ({ page }) => {
    await page.goto('/privacy');
    const prefs = page.locator('#preferences');

    await expect(prefs.getByRole('status')).toContainText('You have not chosen yet');
    await expect(page.locator('[data-cookie-banner]')).toHaveCount(1);

    await prefs.getByRole('button', { name: 'Decline analytics' }).click();
    await expect(prefs.getByRole('status')).toContainText('Analytics is currently off.');
    await expect(prefs.getByRole('button', { name: 'Decline analytics' })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('[data-cookie-banner]')).toHaveCount(0);

    await prefs.getByRole('button', { name: 'Reset choice' }).click();
    await expect(prefs.getByRole('status')).toContainText('You have not chosen yet');
    await expect(page.locator('[data-cookie-banner]')).toHaveCount(1);
  });
});

test.describe('command palette', () => {
  test('finds a component from a natural-language alias', async ({ page }) => {
    await page.goto('/docs');
    await page.getByRole('button', { name: /Search/ }).first().click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('textbox').fill('ai typing indicator');
    await expect(dialog.getByRole('option', { name: /StreamingIndicator/ })).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toHaveCount(0);
  });
});

test.describe('accessibility evidence', () => {
  test('links from the statement and renders the per-component scorecard', async ({ page }) => {
    await page.goto('/accessibility');
    await page.getByRole('link', { name: /Per-component accessibility scorecard/ }).click();
    await expect(page).toHaveURL(/\/accessibility\/scorecard$/);
    await expect(
      page.getByRole('heading', { name: 'Component accessibility scorecard', level: 1 })
    ).toBeVisible();
    await expect(page.getByText('Components', { exact: true }).first()).toBeVisible();
    await expect(page.getByRole('row', { name: /Button/ }).first()).toContainText('Yes');
    await expect(page.getByRole('table')).toContainText('Manifest');
  });
});

test.describe('articles', () => {
  test('index lists the published articles', async ({ page }) => {
    await page.goto('/articles');
    await expect(page.getByRole('heading', { name: 'Articles', level: 1 })).toBeVisible();
    await expect(
      page.getByRole('heading', { name: /We tested 100 AI-generated component usages/ })
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: /component contract, not a component gallery/ })).toBeVisible();
  });

  test('server-renders the article body, table and Article JSON-LD', async ({ page, request }) => {
    const raw = await (await request.get('/articles/validation-benchmark-100-cases')).text();
    // No JavaScript: the benchmark numbers and table must be in the HTML.
    expect(raw).toContain('65.7%');
    expect(raw).toContain('False-positive rate');
    expect(raw).toContain('<table');
    expect(raw).toContain('Article');

    await page.goto('/articles/validation-benchmark-100-cases');
    await expect(
      page.getByRole('heading', { name: /We tested 100 AI-generated component usages/ })
    ).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Recall before repair' })).toBeVisible();
    await expect(page.getByText('65.7%').first()).toBeVisible();
  });

  test('lists article URLs in the sitemap', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).toContain('/articles');
    expect(sitemap).toContain('/articles/validation-benchmark-100-cases');
    expect(sitemap).toContain('/articles/component-contract-not-gallery');
  });
});

test.describe('machine-readable surfaces', () => {
  test('llms.txt, registry and graph describe the same release', async ({ request }) => {
    const llmsResponse = await request.get('/llms.txt');
    expect(llmsResponse.ok()).toBe(true);
    const llms = await llmsResponse.text();

    const version = /Version:\s*([0-9]+\.[0-9]+\.[0-9]+)/.exec(llms)?.[1];
    const counts = /(\d+) components: (\d+) in `@slipstream-ui\/core` and (\d+) in `@slipstream-ui\/ai`/.exec(llms);
    expect(version).toBeTruthy();
    expect(counts).toBeTruthy();

    const total = Number(counts?.[1]);
    const core = Number(counts?.[2]);
    const ai = Number(counts?.[3]);
    expect(core + ai).toBe(total);

    const registry = await (await request.get('/registry/all.json')).json();
    expect(registry.version).toBe(version);
    expect(registry.count).toBe(total);
    expect(registry.counts).toEqual({ core, ai });

    const graph = await (await request.get('/registry/graph.json')).json();
    expect(graph.version).toBe(version);
    expect(graph.nodeCount).toBe(total);
    expect(graph.nodes).toHaveLength(total);

    const recommendations = await (await request.get('/registry/recommendations.json')).json();
    expect(recommendations.count).toBeGreaterThan(0);
    expect(recommendations.recipes).toHaveLength(recommendations.count);
    const graphIds = new Set(graph.nodes.map((node: { id: string }) => node.id));
    for (const recipe of recommendations.recipes) {
      for (const component of recipe.components) {
        expect(graphIds.has(component.id)).toBe(true);
      }
    }

    const sitemap = await (await request.get('/sitemap.xml')).text();
    expect(sitemap).toContain('/playground');
    expect(sitemap).toContain('/docs/components/button');
  });

  test('serves the per-component markdown with the release header', async ({ request }) => {
    const response = await request.get('/llm/components/button.md');
    expect(response.ok()).toBe(true);
    const markdown = await response.text();
    expect(markdown).toContain('Component ID: `button`');
    expect(markdown).toContain('Manifest schema: v1');
    expect(markdown).toContain('https://slipstreamui.com/docs/components/button');
  });
});
