// src/layout/footer.tsx
import { GitHub, Clear } from '@mui/icons-material'
import { IconButton } from '@mui/material'

export function Footer() {
  return (
    <footer className="flex flex-row items-center justify-center gap-2 px-8 py-2 text-center">
      <div className="flex h-8 flex-row items-center gap-2">
        <IconButton
          href="https://github.com/AaaRynt/installed-extensions-manager"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
          size="small"
          color="primary"
          sx={{
            border: 1,
            borderRadius: 3,
            borderColor: 'divider',
            bgcolor: 'divider',
            transition: 'ease 0.3s',
            '&:hover': {
              borderColor: 'primary.main',
            },
          }}
        >
          <GitHub fontSize="small" />
        </IconButton>
        <Clear fontSize="inherit" />
        <IconButton
          href="https://mui.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
          size="small"
          color="primary"
          sx={{
            border: 1,
            borderRadius: 3,
            borderColor: 'divider',
            bgcolor: 'divider',
            transition: 'ease 0.3s',
            '&:hover': {
              borderColor: 'primary.main',
            },
          }}
        >
          <img src="/MUI.svg" alt="MUI" className="h-5" />
        </IconButton>
      </div>
    </footer>
  )
}
