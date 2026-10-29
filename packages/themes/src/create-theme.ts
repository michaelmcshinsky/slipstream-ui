import type { Theme, ThemeConfig, ThemeColors } from './types';

/**
 * Creates a custom theme from brand colors and configuration
 * 
 * @param config - Theme configuration options
 * @returns A complete theme object with CSS variable values
 * 
 * @example
 * ```ts
 * const theme = createTheme({
 *   brandColor: '210 100% 50%',
 *   borderRadius: '0.5rem',
 *   darkMode: true
 * })
 * ```
 */
export function createTheme(config: ThemeConfig = {}): Theme {
  const {
    brandColor = '210 100% 50%',
    borderRadius = '0.5rem',
    darkMode = false,
  } = config;

  // Generate color palette from brand color
  const baseColor = brandColor;
  
  const colors: ThemeColors = {
    // Background colors
    background: darkMode ? '222.2 84% 4.9%' : '0 0% 100%',
    foreground: darkMode ? '210 40% 98%' : '222.2 84% 4.9%',
    
    // Primary colors (brand-based)
    primary: baseColor,
    'primary-foreground': darkMode ? '210 40% 98%' : '0 0% 100%',
    
    // Secondary colors
    secondary: darkMode ? '217.2 32.6% 17.5%' : '210 40% 96.1%',
    'secondary-foreground': darkMode ? '210 40% 98%' : '222.2 47.4% 11.2%',
    
    // Muted colors
    muted: darkMode ? '217.2 32.6% 17.5%' : '210 40% 96.1%',
    'muted-foreground': darkMode ? '215 20.2% 65.1%' : '215.4 16.3% 46.9%',
    
    // Accent colors
    accent: darkMode ? '217.2 32.6% 17.5%' : '210 40% 96.1%',
    'accent-foreground': darkMode ? '210 40% 98%' : '222.2 47.4% 11.2%',
    
    // Destructive colors
    destructive: darkMode ? '0 62.8% 30.6%' : '0 84.2% 60.2%',
    'destructive-foreground': darkMode ? '210 40% 98%' : '210 40% 98%',

    // Status colors (success / warning / info)
    success: darkMode ? '142.1% 70.6% 35.3%' : '142.1% 70.6% 45.3%',
    'success-foreground': darkMode ? '210 40% 98%' : '0 0% 100%',
    warning: darkMode ? '35.5% 91.7% 32.9%' : '38 92% 50%',
    'warning-foreground': darkMode ? '26 83.3% 14.1%' : '0 0% 100%',
    info: darkMode ? '198.4% 93.2% 59.6%' : '198.4% 93.2% 49.6%',
    'info-foreground': darkMode ? '222.2% 47.4% 11.2%' : '0 0% 100%',
    
    // Border and input
    border: darkMode ? '217.2 32.6% 17.5%' : '214.3 31.8% 91.4%',
    input: darkMode ? '217.2 32.6% 17.5%' : '214.3 31.8% 91.4%',
    
    // Ring (focus state)
    ring: baseColor,
    
    // Card colors
    card: darkMode ? '222.2 84% 4.9%' : '0 0% 100%',
    'card-foreground': darkMode ? '210 40% 98%' : '222.2 84% 4.9%',
    
    // Popover colors
    popover: darkMode ? '222.2 84% 4.9%' : '0 0% 100%',
    'popover-foreground': darkMode ? '210 40% 98%' : '222.2 84% 4.9%',
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

/**
 * Generates CSS variables from a theme for use in CSS-in-JS or stylesheets
 * 
 * @param theme - The theme object
 * @returns CSS variable declarations as a string
 * 
 * @example
 * ```ts
 * const theme = createTheme({ brandColor: '210 100% 50%' });
 * const cssVars = themeToCssVariables(theme);
 * // Returns: "--background: 0 0% 100%; --foreground: 222.2 84% 4.9%; ..."
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
