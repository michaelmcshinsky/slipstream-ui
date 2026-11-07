import { describe, expect, it } from 'vitest';
import { documentHead } from './document-head';

describe('documentHead', () => {
  it('defaults to indexable robots', () => {
    expect(documentHead({ title: 'Classes' })).toEqual({
      title: 'Classes',
      robots: 'index, follow',
    });
  });

  it('includes the description and canonical URL', () => {
    expect(
      documentHead({
        title: 'Classes',
        description: 'Manage your weekly schedule.',
        canonical: 'https://example.com/classes',
      })
    ).toEqual({
      title: 'Classes',
      description: 'Manage your weekly schedule.',
      canonical: 'https://example.com/classes',
      robots: 'index, follow',
    });
  });

  it('emits noindex, nofollow for private pages', () => {
    expect(documentHead({ title: 'Draft', noindex: true }).robots).toBe('noindex, nofollow');
  });
});
