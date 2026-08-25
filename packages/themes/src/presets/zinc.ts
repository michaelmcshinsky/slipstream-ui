import { createTheme } from '../create-theme';

/**
 * Zinc theme - neutral gray tones
 */
export const zincTheme = createTheme({
  brandColor: '240 5% 65%',
  borderRadius: '0.5rem',
  darkMode: false,
});

export const zincDarkTheme = createTheme({
  brandColor: '240 5% 65%',
  borderRadius: '0.5rem',
  darkMode: true,
});
