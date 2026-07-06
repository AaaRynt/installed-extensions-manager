// src/layout/header.tsx
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import MuiAppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { styled, useTheme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import * as React from 'react'

const drawerWidth = 160
const tempArr = Array.from({ length: 10 }, (_, i) => i)

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{ open?: boolean }>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      },
    },
  ],
}))

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })<{ open?: boolean }>(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 2),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}))

export function SearchBar({ placeholder = 'Search…' }: { placeholder?: string }) {
  return (
    <Box
      sx={(theme) => ({
        position: 'relative',
        width: '100%',
        ml: 0,
        borderRadius: 1,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        [theme.breakpoints.up('sm')]: {
          width: 'auto',
          ml: 1,
        },
      })}
    >
      <Box
        sx={{
          position: 'absolute',
          inset: '0 auto 0 0',
          px: 2,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'inherit',
          zIndex: 1,
        }}
      >
        <SearchIcon />
      </Box>
      <InputBase
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'search' }}
        sx={(theme) => ({
          width: '100%',
          color: 'inherit',
          '& .MuiInputBase-input': {
            py: 0.5,
            pr: 0.5,
            pl: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            [theme.breakpoints.up('sm')]: {
              width: '12ch',
              '&:focus': {
                width: '20ch',
              },
            },
          },
        })}
      />
    </Box>
  )
}

function Select() {
  return (
    <>
      <Divider sx={{ borderColor: 'divider', margin: '0 0.5rem' }} />
      <List>
        {tempArr.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  )
}

export function Header() {
  const theme = useTheme()
  const [open, setOpen] = React.useState(false)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  const handleDrawerClose = () => {
    setOpen(false)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} variant="elevation">
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                mr: 2,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h5" noWrap component="div" sx={{ flexGrow: 1, fontSize: '1.2rem' }}>
            <a href="/">Installed Extensions Manager</a>
          </Typography>
          <SearchBar />
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: '#282828',
            color: 'inherit',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon color="info" /> : <ChevronRightIcon color="info" />}
          </IconButton>
        </DrawerHeader>
        <Select />
        <Select />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Typography>Hello, World!</Typography>
      </Main>
    </Box>
  )
}
