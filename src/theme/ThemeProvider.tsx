import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from 'react'
import type { ThemeId } from './themes'
import { getInitialTheme, persistTheme } from './themeStorage'

interface ThemeContextValue {
  theme: ThemeId
  setTheme: (id: ThemeId) => void
}
const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(getInitialTheme)

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const setTheme = (id: ThemeId) => {
    persistTheme(id)
    setThemeState(id)
  }

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
