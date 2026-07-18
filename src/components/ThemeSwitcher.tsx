import { useTheme } from '../theme/ThemeProvider'
import { THEME_LIST } from '../theme/themes'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  return (
    <div className="theme-switcher" role="group" aria-label="Theme">
      {THEME_LIST.map((t) => (
        <button
          key={t.id}
          className={`theme-dot ${theme === t.id ? 'active' : ''}`}
          data-theme-dot={t.id}
          aria-label={t.label}
          aria-pressed={theme === t.id}
          title={t.label}
          onClick={() => setTheme(t.id)}
        />
      ))}
    </div>
  )
}
