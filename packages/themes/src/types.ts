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
}
