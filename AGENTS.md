# AGENTS.md

## Project Overview

「点击游戏」(Easy Click Game) — a puzzle web game. Clicking a cell increments the number in that cell and its 4 orthogonal neighbors by 1 (mod 3). The goal is to make all numbers become 0 within the allowed number of clicks (difficulty²). Deployed as a static site on Netlify.

## Tech Stack

- Vue 3 (Composition API, `<script setup>`) + Vue CLI 5
- SCSS for styles
- UnoCSS with `presetAttributify` and `presetIcons` (carbon / mdi collections)
- Canvas Confetti for win effects

## Commands

```bash
yarn install          # install dependencies
yarn serve            # dev server at localhost:8080
yarn build            # production build (also bumps sw.js cache name, copies sw.js and a2hs/ to dist/)
yarn lint             # eslint
```

## Project Structure

- `src/components/ClickGame.vue` — main game board, all game logic (click, undo/redo, win/lose, autoplay "god mode")
- `src/components/TopHeader.vue` — fixed header: help dialog, audio toggle, title, theme and language toggles. Clicking the title 5 times consecutively clears score records (easter egg)
- `src/components/HelpDialog.vue` — game rules dialog
- `src/plugins/i18n.js` — minimal custom i18n (en/cn), all UI copy lives here; add new keys to both languages
- `src/utils/theme.js` — light/dark theme, toggles `body.dark` class
- `src/utils/difficulty.js` — global difficulty state (3–10), persisted in localStorage
- `sw.js` — service worker; `update.js` rewrites its cache name on each build

## Conventions

- Icons are written in attributify mode: `<i i-carbon-undo />`, `<i i-carbon-sun />` (not class-based)
- All game/record persistence uses localStorage with the `__easy_click_game__` prefix (per-difficulty best scores use the prefix + difficulty number)
- CSS theming goes through CSS variables defined on `body` / `body.dark` in `src/App.vue` (`--bg-color`, `--card-bg-color`, `--border-color`, etc.) — do not hardcode colors that need to respond to dark mode
- Layout is mobile-first, max content width 480px; cards use 16px border radius and 12px side margins
- eslint runs on build; unused imports will fail the build (`no-unused-vars` is an error)
- User-facing text must be added to `src/plugins/i18n.js` in both Chinese and English
