import CssBaseline from '@mui/material/CssBaseline'
import Stack from '@mui/material/Stack'
import { ThemeProvider, createTheme } from '@mui/material/styles'

// src/App.tsx
import { Footer, Header, Main } from '@/layout'

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class',
  },
  colorSchemes: {
    light: true,
    dark: true,
  },
  defaultColorScheme: 'dark',
})

export default function App() {
  return (
    <ThemeProvider theme={theme} defaultMode="dark" disableTransitionOnChange>
      <CssBaseline />
      <Stack sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
        <Header />
        <Main />
        <Footer />
      </Stack>
    </ThemeProvider>
  )
}
