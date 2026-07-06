# MUI Project Skill Guide

## Core Philosophy

Material UI is the primary UI system in this project.
Do not treat it as just components, but as a design system.

## Layout Rules

- Use Box / Stack / Grid for layout
- Avoid raw div unless absolutely necessary
- Prefer Stack for vertical/horizontal layout
- Use Grid only for page-level layout

## Component Mapping

### Data Display

- Card → primary item container (Extension, Project)
- Chip → category / tag / status
- Avatar → icon / extension logo

### Navigation

- Drawer → sidebar navigation + detail panel
- Tabs → view switching inside page

### Input

- TextField → search input
- Select → filters
- Switch → enabled/disabled toggle

### Feedback

- Snackbar → async action result
- Alert → error/info inside page
- Dialog → create/edit flow

## MUI System Rules

- Use sx only for small visual adjustments
- Do NOT build layout with sx alone
- Use theme palette instead of hex colors
- Prefer:
  - text.secondary
  - primary.main
  - background.paper

## Data Rules

- All data comes from mockExtensions.ts
- No backend
- State persistence via localStorage only

## Anti-patterns

- Do not mix Tailwind for layout logic
- Do not use inline styles for layout
- Do not recreate MUI components manually
- Do not bypass theme system

## UI Structure Pattern

Page layout should follow:

AppBar
→ Sidebar Drawer
→ Main Content Grid/List
→ Optional Detail Drawer
→ Snackbar feedback layer
