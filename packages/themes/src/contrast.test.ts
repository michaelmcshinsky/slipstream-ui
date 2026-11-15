import { describe, expect, it } from 'vitest';
import { createTheme } from './create-theme';

type Rgb = [number, number, number];

/** Parses the theme's unitless "H S% L%" strings. */
function parseHsl(value: string): [number, number, number] {
  const [h, s, l] = value.trim().split(/\s+/);
  return [Number(h), Number(s.replace('%', '')) / 100, Number(l.replace('%', '')) / 100];
}

function hslToRgb(value: string): Rgb {
  const [h, s, l] = parseHsl(value);
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const m = l - c / 2;
  let rgb: Rgb;
  if (hp < 1) rgb = [c, x, 0];
  else if (hp < 2) rgb = [x, c, 0];
  else if (hp < 3) rgb = [0, c, x];
  else if (hp < 4) rgb = [0, x, c];
  else if (hp < 5) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return rgb.map((channel) => channel + m) as Rgb;
}

function luminance([r, g, b]: Rgb): number {
  const linear = (channel: number) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function contrast(a: Rgb, b: Rgb): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** Composites a colour at `alpha` over an opaque background. */
function over(foreground: string, background: Rgb, alpha: number): Rgb {
  const fg = hslToRgb(foreground);
  return fg.map((channel, index) => channel * alpha + background[index] * (1 - alpha)) as Rgb;
}

const WHITE: Rgb = [1, 1, 1];

describe('semantic ink tokens', () => {
  it('success ink clears 4.5:1 on a 10% success tint over white', () => {
    const theme = createTheme();
    const tint = over(theme.colors.success, WHITE, 0.1);
    expect(contrast(hslToRgb(theme.colors['success-ink']), tint)).toBeGreaterThanOrEqual(4.5);
  });

  it('plain success text does not clear 4.5:1 on that tint', () => {
    const theme = createTheme();
    const tint = over(theme.colors.success, WHITE, 0.1);
    // The reason the ink token exists; if this ever passes, revisit the token.
    expect(contrast(hslToRgb(theme.colors.success), tint)).toBeLessThan(4.5);
  });

  it('success ink clears 4.5:1 on a 10% tint over the dark card', () => {
    const theme = createTheme({ darkMode: true });
    const card = hslToRgb(theme.colors.card);
    const tint = over(theme.colors.success, card, 0.1);
    expect(contrast(hslToRgb(theme.colors['success-ink']), tint)).toBeGreaterThanOrEqual(4.5);
  });

  it('warning and info inks keep their 4.5:1 contract on tints', () => {
    for (const mode of [false, true]) {
      const theme = createTheme({ darkMode: mode });
      const surface = mode ? hslToRgb(theme.colors.card) : WHITE;
      for (const token of ['warning', 'info'] as const) {
        const tint = over(theme.colors[token], surface, 0.1);
        const ink = theme.colors[`${token}-ink` as 'warning-ink' | 'info-ink'];
        expect(contrast(hslToRgb(ink), tint)).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it('destructive text clears 4.5:1 on the popover surface', () => {
    for (const mode of [false, true]) {
      const theme = createTheme({ darkMode: mode });
      expect(
        contrast(hslToRgb(theme.colors.destructive), hslToRgb(theme.colors.popover))
      ).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('primary ink clears 4.5:1 on white and on a primary tint', () => {
    const theme = createTheme({ brandColor: '224 89% 58%' });
    const tint = over(theme.colors.primary, WHITE, 0.1);
    expect(contrast(hslToRgb(theme.colors['primary-ink']), WHITE)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(hslToRgb(theme.colors['primary-ink']), tint)).toBeGreaterThanOrEqual(4.5);
  });

  it('dark-mode primary ink clears 4.5:1 on the dark card', () => {
    const theme = createTheme({ brandColor: '224 89% 58%', darkMode: true });
    expect(
      contrast(hslToRgb(theme.colors['primary-ink']), hslToRgb(theme.colors.card))
    ).toBeGreaterThanOrEqual(4.5);
  });

  it('every theme colour parses as unitless HSL', () => {
    for (const mode of [false, true]) {
      const theme = createTheme({ darkMode: mode });
      for (const [name, value] of Object.entries(theme.colors)) {
        expect(value, name).toMatch(/^\d+(\.\d+)? \d+(\.\d+)?% \d+(\.\d+)?%$/);
      }
    }
  });
});
