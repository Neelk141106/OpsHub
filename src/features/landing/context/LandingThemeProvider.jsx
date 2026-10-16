import { useState, useEffect } from 'react'
import { LandingThemeContext, LANDING_THEME_KEY } from './useLandingTheme'

export default function LandingThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    try {
      const saved = localStorage.getItem(LANDING_THEME_KEY)
      if (saved === 'dark' || saved === 'light') return saved
      return 'dark'
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(LANDING_THEME_KEY, theme)
    } catch {
      // ignore
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const isDark = theme === 'dark'

  return (
    <LandingThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </LandingThemeContext.Provider>
  )
}
