import { useTheme } from '../theme/ThemeProvider'
import { FiMoon, FiSun } from 'react-icons/fi'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle color theme" aria-pressed={isDark}>
      {isDark ? <FiSun aria-hidden /> : <FiMoon aria-hidden />}
    </button>
  )
}