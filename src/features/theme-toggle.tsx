// src/features/theme-toggle.tsx
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import IconButton from '@mui/material/IconButton'
import { useColorScheme } from '@mui/material/styles'

export function ThemeToggle() {
  const { mode, setMode, systemMode } = useColorScheme()

  if (!mode) {
    return null
  }
  const resolvedMode = mode === 'system' ? systemMode : mode
  const isDark = resolvedMode === 'dark'

  function handleToggle() {
    setMode(isDark ? 'light' : 'dark')
  }

  return (
    <IconButton
      onClick={handleToggle}
      color="inherit"
      sx={{ ml: 1 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? <LightModeIcon /> : <DarkModeIcon />}
    </IconButton>
  )
}
