import { createContext, useContext } from 'react'

export const LANDING_THEME_KEY = 'opshub_landing_theme'

export const LandingThemeContext = createContext({
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {},
})

export function useLandingTheme() {
  const context = useContext(LandingThemeContext)
  if (!context) {
    throw new Error('useLandingTheme must be used within a LandingThemeProvider')
  }
  return context
}
