import { beforeEach, describe, expect, it } from 'vitest';
import { applyTheme, persistTheme, resolveDark, THEME_STORAGE_KEY } from './theme';

function colorSchemeMetas() {
  return Array.from(document.querySelectorAll<HTMLMetaElement>('meta[name="color-scheme"]'));
}

beforeEach(() => {
  document.documentElement.classList.remove('dark');
  document.head.innerHTML = '';
  localStorage.clear();
});

describe('resolveDark', () => {
  it('follows the OS preference when nothing is stored', () => {
    expect(resolveDark(null, true)).toBe(true);
    expect(resolveDark(null, false)).toBe(false);
  });

  it('honors an explicit stored choice over the OS preference', () => {
    expect(resolveDark('dark', false)).toBe(true);
    expect(resolveDark('light', true)).toBe(false);
  });
});

describe('applyTheme', () => {
  it('toggles the .dark class and syncs every color-scheme meta', () => {
    document.head.innerHTML =
      '<meta name="color-scheme" content="light dark"><meta name="color-scheme" content="light dark">';

    applyTheme(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(colorSchemeMetas().map((m) => m.content)).toEqual(['dark', 'dark']);

    applyTheme(false);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(colorSchemeMetas().map((m) => m.content)).toEqual(['light', 'light']);
  });
});

describe('persistTheme', () => {
  it('stores an explicit override that differs from the OS', () => {
    persistTheme(true, false);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
    persistTheme(false, true);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  it('clears the override when the choice matches the OS', () => {
    localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    persistTheme(true, true);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });
});
