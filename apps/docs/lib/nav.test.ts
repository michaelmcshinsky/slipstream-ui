import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { FLAT_NAV } from './nav';

const COMPONENTS_DIR = join(__dirname, '..', 'app', 'docs', 'components');

describe('nav component hrefs', () => {
  it('every /docs/components/* nav href resolves to a page directory', () => {
    const missing = FLAT_NAV.filter((item) => item.href.startsWith('/docs/components/'))
      .map((item) => item.href.replace('/docs/components/', ''))
      .filter((slug) => !existsSync(join(COMPONENTS_DIR, slug, 'page.tsx')));
    expect(missing).toEqual([]);
  });
});
