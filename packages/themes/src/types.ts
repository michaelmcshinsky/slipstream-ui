/**
 * Theme Types
 * 
 * Type definitions for the theming system
 */

export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  'primary-foreground': string;
  secondary: string;
  'secondary-foreground': string;
  muted: string;
  'muted-foreground': string;
  accent: string;
  'accent-foreground': string;
  destructive: string;
  'destructive-foreground': string;
  success: string;
  'success-foreground': string;
  warning: string;
  'warning-foreground': string;
  info: string;
  'info-foreground': string;
  border: string;
  input: string;
  ring: string;
  card: string;
  'card-foreground': string;
  popover: string;
  'popover-foreground': string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  borderRadius?: string;
  radius?: {
    lg: string;
    md: string;
    sm: string;
  };
  /** Spacing density: controls padding/height of interactive elements. */
  density?: {
    /** Vertical padding token (default '0.5rem'). */
    space: string;
    /** Control height token (default '2.25rem'). */
    controlHeight: string;
  };
  /** Motion tokens for transitions and animations. */
  motion?: {
    /** Fast transition duration (default '150ms'). */
    fast: string;
    /** Normal transition duration (default '250ms'). */
    normal: string;
    /** Slow transition duration (default '400ms'). */
    slow: string;
    /** Standard easing curve (default 'cubic-bezier(0.4, 0, 0.2, 1)'). */
    ease: string;
    /** Entrance/exit easing curve (default 'cubic-bezier(0.0, 0, 0.2, 1)'). */
    easeIn: string;
    /** Spring-like easing for emphasis (default 'cubic-bezier(0.34, 1.56, 0.64, 1)'). */
    easeOut: string;
  };
}

export interface ThemeConfig {
  /**
   * Brand color in HSL format (e.g., "210 100% 50%")
   */
  brandColor?: string;
  /**
   * Border radius in rem
   */
  borderRadius?: string;
  /**
   * Whether to use dark mode as default
   */
  darkMode?: boolean;
  /**
   * Spacing density: 'compact' | 'normal' | 'relaxed'
   */
  density?: 'compact' | 'normal' | 'relaxed';
}
