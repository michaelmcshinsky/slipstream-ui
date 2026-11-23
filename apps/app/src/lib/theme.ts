/**
 * App theme state. `.dark` on <html> is the source of truth for the token
 * swap and Tailwind `dark:` variants; <meta name="color-scheme"> is kept in
 * sync so UA chrome (scrollbars, form controls) follows the same scheme.
 * The pre-paint script in app/layout.tsx mirrors resolveDark/applyTheme
 * because it must run before any module can load.
 */

export const THEME_STORAGE_KEY = 'slipstream-theme';

export function resolveDark(stored: string | null, prefersDark: boolean): boolean {
  return stored ? stored === 'dark' : prefersDark;
}

/** Applies the resolved scheme to <html> and every color-scheme meta. */
export function applyTheme(dark: boolean): void {
  document.documentElement.classList.toggle('dark', dark);
  document
    .querySelectorAll('meta[name="color-scheme"]')
    .forEach((meta) => ((meta as HTMLMetaElement).content = dark ? 'dark' : 'light'));
}

/**
 * Persists an explicit choice, or drops the key when it matches the OS so the
 * media-query listener keeps following live system changes.
 */
export function persistTheme(dark: boolean, systemDark: boolean): void {
  if (dark === systemDark) {
    localStorage.removeItem(THEME_STORAGE_KEY);
  } else {
    localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light');
  }
}
