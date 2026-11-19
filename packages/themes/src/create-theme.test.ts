import { describe, expect, it } from 'vitest';
import { createTheme, themeToCssVariables } from './create-theme';

describe('themeToCssVariables', () => {
  it('emits color-scheme so native chrome follows the theme', () => {
    expect(themeToCssVariables(createTheme())).toContain('color-scheme: light;');
    expect(themeToCssVariables(createTheme({ darkMode: true }))).toContain('color-scheme: dark;');
  });

  it('puts color-scheme first so it applies to the selector', () => {
    expect(themeToCssVariables(createTheme()).startsWith('color-scheme: light;')).toBe(true);
  });

  it('still emits the token variables', () => {
    const css = themeToCssVariables(createTheme());
    expect(css).toContain('--background:');
    expect(css).toContain('--primary:');
  });
});
