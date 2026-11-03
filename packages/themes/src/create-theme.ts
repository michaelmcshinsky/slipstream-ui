import type { Theme, ThemeConfig, ThemeColors } from './types';

/**
 * Creates a custom theme from brand colors and configuration.
 *
 * The light/dark palettes follow the Axial-inspired house style (shared
 * spec with apps/docs/app/globals.css): pure-white surfaces and navy ink
 * in light mode; a navy-tinted surface ladder (background < card < popover)
 * with crisp borders and a *lightened* primary in dark mode so links AND
 * buttons both clear WCAG AA on dark backgrounds.
 *
 * Hue values are unitless — percent hues invalidate the whole hsl()
 * declaration and silently drop the color.
 *
 * @example
 * ```ts
 * const theme = createTheme({
 *   brandColor: '224 89% 58%',
 *   borderRadius: '0.375rem',
 *   darkMode: true
 * })
 * ```
 */
export function createTheme(config: ThemeConfig = {}): Theme {
  const {
    brandColor = '224 89% 58%',
    borderRadius = '0.375rem',
    darkMode = false,
  } = config;

  const baseColor = brandColor;

  const colors: ThemeColors = {
    // Surfaces
    background: darkMode ? '222 42% 5%' : '0 0% 100%',
    foreground: darkMode ? '210 40% 96%' : '222 85% 7%',

    // Primary (brand-based; derived for dark so light-blue + navy ink
    // passes AA both as button background and as link text)
    primary: darkMode ? lightenForDark(baseColor) : baseColor,
    'primary-foreground': darkMode ? inkForDark(baseColor) : '0 0% 100%',

    // Secondary / muted / accent
    secondary: darkMode ? '217 26% 15%' : '214 45% 96%',
    'secondary-foreground': darkMode ? '210 40% 96%' : '222 47% 11%',
    muted: darkMode ? '217 26% 15%' : '214 40% 96%',
    'muted-foreground': darkMode ? '215 16% 62%' : '219 12% 42%',
    accent: darkMode ? '217 26% 15%' : '214 45% 96%',
    'accent-foreground': darkMode ? '210 40% 96%' : '222 47% 11%',

    // Destructive — dark text carries AA on bg and card; solid fills take ink
    destructive: darkMode ? '0 76% 58%' : '348 68% 44%',
    'destructive-foreground': darkMode ? '222 75% 10%' : '0 0% 100%',

    // Status colors (success / warning / info) — unitless hues.
    // Solid semantic fills carry navy-ink foregrounds: mid-luminance
    // colors cannot hold 4.5:1 against white, and ink-on-color is the
    // Axial house style anyway. Text usage (tints) is the primary path.
    success: darkMode ? '142 62% 52%' : '142 63% 32%',
    'success-foreground': darkMode ? '222 75% 10%' : '0 0% 100%',
    warning: darkMode ? '38 92% 60%' : '38 92% 50%',
    'warning-foreground': '26 83% 14%',
    info: darkMode ? '198 80% 56%' : '198 74% 38%',
    'info-foreground': '222 75% 10%',

    // Borders: dark gets a crisp 24% navy line; inputs read brighter (32%)
    border: darkMode ? '217 20% 24%' : '214 28% 89%',
    input: darkMode ? '217 18% 32%' : '214 28% 89%',
    ring: darkMode ? lightenForDark(baseColor) : baseColor,

    // Card / popover: elevated steps above the dark background
    card: darkMode ? '222 36% 9%' : '0 0% 100%',
    'card-foreground': darkMode ? '210 40% 96%' : '222 85% 7%',
    popover: darkMode ? '222 36% 11%' : '0 0% 100%',
    'popover-foreground': darkMode ? '210 40% 96%' : '222 85% 7%',
  };

  return {
    name: 'custom',
    colors,
    borderRadius,
    radius: {
      lg: borderRadius,
      md: `calc(${borderRadius} - 2px)`,
      sm: `calc(${borderRadius} - 4px)`,
    },
    density: {
      space: config.density === 'compact' ? '0.375rem' : config.density === 'relaxed' ? '0.75rem' : '0.5rem',
      controlHeight: config.density === 'compact' ? '2rem' : config.density === 'relaxed' ? '2.5rem' : '2.25rem',
    },
    motion: {
      fast: '150ms',
      normal: '250ms',
      slow: '400ms',
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  };
}

/** Parse a `H S% L%` triplet; null when the input is not a plain HSL triple. */
function parseHsl(value: string): { h: number; s: number; l: number } | null {
  const parts = value.trim().split(/\s+/);
  if (parts.length !== 3) return null;
  const [h, s, l] = parts.map((part) => parseFloat(part));
  if ([h, s, l].some((n) => Number.isNaN(n))) return null;
  return { h, s, l };
}

/**
 * Dark surfaces need a lighter primary (light-blue) so it works as link
 * text on near-black backgrounds; saturation is floored so it stays vivid.
 */
function lightenForDark(hsl: string): string {
  const parsed = parseHsl(hsl);
  if (!parsed) return hsl;
  const light = Math.max(parsed.l, 70);
  const sat = Math.min(95, Math.max(parsed.s, 60));
  return `${Math.round(parsed.h)} ${Math.round(sat)}% ${Math.round(light)}%`;
}

/** Matching ink (navy-tinted dark) foreground for the light-blue primary. */
function inkForDark(hsl: string): string {
  const parsed = parseHsl(hsl);
  if (!parsed) return '210 40% 98%';
  return `${Math.round(parsed.h)} 75% 10%`;
}

/**
 * Generates CSS variables from a theme for use in CSS-in-JS or stylesheets
 *
 * @param theme - The theme object
 * @returns A string of CSS variable declarations
 *
 * @example
 * ```ts
 * const theme = createTheme({ brandColor: '224 89% 58%' });
 * const cssVars = themeToCssVariables(theme);
 * // Returns: "--background: 0 0% 100%; --foreground: 222 85% 7%; ..."
 * ```
 */
export function themeToCssVariables(theme: Theme): string {
  const vars = Object.entries(theme.colors).map(([key, value]) => {
    const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    return `--${cssVarName}: ${value};`;
  });

  // Multi-token radius: Tailwind maps rounded-{sm,md,lg} to these variables.
  const radius = theme.radius ?? {
    lg: theme.borderRadius,
    md: `calc(${theme.borderRadius} - 2px)`,
    sm: `calc(${theme.borderRadius} - 4px)`,
  };
  vars.push(`--radius: ${theme.borderRadius};`);
  vars.push(`--radius-lg: ${radius.lg};`);
  vars.push(`--radius-md: ${radius.md};`);
  vars.push(`--radius-sm: ${radius.sm};`);

  // Density tokens: spacing and control sizing.
  const density = theme.density ?? { space: '0.5rem', controlHeight: '2.25rem' };
  vars.push(`--density-space: ${density.space};`);
  vars.push(`--density-control-height: ${density.controlHeight};`);

  // Motion tokens: durations and easing curves.
  const motion = theme.motion ?? {
    fast: '150ms',
    normal: '250ms',
    slow: '400ms',
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  };
  vars.push(`--motion-fast: ${motion.fast};`);
  vars.push(`--motion-normal: ${motion.normal};`);
  vars.push(`--motion-slow: ${motion.slow};`);
  vars.push(`--motion-ease: ${motion.ease};`);
  vars.push(`--motion-ease-in: ${motion.easeIn};`);
  vars.push(`--motion-ease-out: ${motion.easeOut};`);

  return vars.join('\n  ');
}
