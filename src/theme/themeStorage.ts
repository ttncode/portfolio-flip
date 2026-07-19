import { DEFAULT_THEME, isThemeId, type ThemeId } from './themes'

export const STORAGE_KEY = 'portfolio-theme'

export function getInitialTheme(): ThemeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored && isThemeId(stored)) return stored
  } catch {
    /* localStorage unavailable (SSR/private mode) — fall through */
  }
  return DEFAULT_THEME
}

export function persistTheme(id: ThemeId): void {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    /* ignore write failures */
  }
}
