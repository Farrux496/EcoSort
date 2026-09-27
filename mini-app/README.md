# EcoSort — Tábiyattı birge qorǵaymız

A fully client-side waste-sorting and rewards platform for Qaraqalpaqstan. All data (accounts, EcoCoins, waste submissions, courier scheduling, certificates, missions, game progress, notifications, withdrawals, statistics, and admin data) is stored locally in the browser — no backend or external API is required.

This app is now embedded in the [EcoSort Waste Recycling System](../README.md)
repo as its Telegram Mini App: it's opened by `../tg-bot`'s "Open App"
button and deployed by the root `netlify.toml`. `src/services/telegram.ts`
handles the Telegram WebApp SDK - identity, language, theme, back button -
and falls back to the login/register flow below when run standalone
outside Telegram (e.g. locally, or as its own site).

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install --legacy-peer-deps`
   (plain `npm install` currently fails on a peer-dependency mismatch
   between Vite 8 and `@tailwindcss/vite`'s pinned esbuild range)
2. Run the app:
   `npm run dev`

## Build

`npm run build`

The app is a static site (React + Vite) and is ready to deploy to Netlify or any static host.
