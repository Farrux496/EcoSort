# EcoSort — Waste Recycling System

A Telegram-first e-waste recycling MVP: a Telegram Mini App for browsing,
submitting recyclable waste, tracking rewards, and a lightweight gamification
layer, plus a companion Telegram Bot.

The Mini App was originally a set of static HTML pages, then was replaced
with a richer standalone React app ("EcoSort — Tábiyattı birge qorǵaymız",
built separately). This repo now merges the two: the React app lives under
`mini-app/` and is the one deployed and opened by the bot. The static
version is preserved under `legacy-web-mini-app/` for reference, and the
original PHP/MySQL backend that predates both is preserved under
`legacy-php/`.

## Project Architecture

```text
ECOSORT PROJECT
      │
      ├── mini-app/               Telegram Mini App (React + Vite SPA,
      │                           also works as a normal website).
      │                           This is what Netlify deploys and what
      │                           the bot's "Open App" button opens.
      │
      ├── tg-bot/                 Telegram Bot (separate Node.js process)
      │
      ├── legacy-web-mini-app/    Earlier static HTML/CSS/JS Mini App,
      │                           kept for reference, NOT deployed
      │
      └── legacy-php/             Original PHP/MySQL backend, kept for
                                   reference only, NOT deployed, NOT
                                   required for the MVP
```

**Scope note:** EcoSort's purpose is collecting and recycling waste for a
reward - not reselling refurbished electronics, and not a login/registration
system. Inside Telegram, identity comes from Telegram itself (see
`mini-app/src/services/telegram.ts`) - there's no email/password flow there.
Outside Telegram (plain browser), `mini-app/` falls back to its own
demo login/register screen so it can still be built and tested standalone.

### Screens (`mini-app/src/components/views/`)

The app is a single-page app; these are in-app screens rather than
separate URLs:

| Screen | Purpose |
|---|---|
| `WelcomeView` | Landing / login-register (browser fallback mode only) |
| `DashboardView` | Home screen |
| `ScannerView` | Submit waste for recycling (photo, type, weight -> reward) |
| `CategoriesView` | What waste categories are collected |
| `WalletView` | Balance, coin balance, withdrawal requests |
| `GameView` | Eco Clicker gamification (coins, upgrades, missions) |
| `StatisticsView`, `HistoryView`, `RankingView` | Stats, submission history, leaderboard |
| `CourierScheduleView`, `LocationsView` | Pickup scheduling, recycling points map |
| `ProfileView`, `SettingsView` | Profile and app settings |
| `AdminView` | Internal admin panel - reachable only when `currentUser.role === 'admin'`. Inside Telegram, the bot's hidden `/admin` command (password-gated) opens the app with `?admin=1`, which elevates the Telegram user to admin for that session; see `mini-app/src/services/telegram.ts`. |

Language switching (Qaraqalpaq / Uzbek / Russian) is available from the
header on most screens, plus automatic detection from Telegram's
`language_code` when opened as a Mini App.

### Data layer (MVP)

Everything currently runs on **`localStorage`**, through
`mini-app/src/services/storage.ts` (single source of truth for reads/
writes, seeded with demo data on first run) and
`mini-app/src/services/telegram.ts` (Telegram WebApp SDK init, identity,
language, back-button wiring).

## Installation

No global setup beyond Node.js - the Mini App is a normal npm project:

```bash
cd mini-app
npm install --legacy-peer-deps
npm run dev
# open http://localhost:3000
```

(`--legacy-peer-deps` works around a peer-dependency mismatch between this
Vite 8 project and `@tailwindcss/vite`'s pinned esbuild range - plain
`npm install` currently refuses to resolve it.)

For the bot, see `tg-bot/README.md`.

## Local Development

- Frontend: edit files under `mini-app/src/`, Vite hot-reloads in the
  browser.
- Outside Telegram, the app runs in **browser fallback mode** automatically
  (login/register or the welcome screen's demo-user buttons - see
  `mini-app/src/services/telegram.ts` / `AuthModals.tsx`).
- Bot: `cd tg-bot && npm install && npm start` (needs `.env`, see below).

## Environment Variables

Two `.env.example` files exist - one at the repo root (documents the
variables the whole project uses) and one in `tg-bot/` (the bot needs its
own copy since it typically deploys separately from Netlify):

```env
TELEGRAM_BOT_TOKEN=       # from @BotFather - NEVER put this in frontend code
TELEGRAM_BOT_USERNAME=    # e.g. chiqindi_bot
TELEGRAM_WEBAPP_URL=      # your deployed Netlify URL, e.g. https://chiqindi.netlify.app/
```

`.env` is gitignored everywhere in this repo. `mini-app/` never reads or
embeds `TELEGRAM_BOT_TOKEN` - only the bot does.

## Telegram Bot Setup

See `tg-bot/README.md` for full instructions. Summary:

```bash
cd tg-bot
npm install
cp .env.example .env   # then fill in your bot token
npm start
```

Commands: `/start`, `/help`, `/app`, `/profile`, `/admin`.

## Telegram Mini App Setup

1. Deploy `mini-app/` to Netlify (see below) to get a public HTTPS URL.
2. Set that URL as `TELEGRAM_WEBAPP_URL` in the bot's `.env`.
3. In [@BotFather](https://t.me/BotFather), set the bot's Menu Button (or
   use `/start`'s inline button, already wired up in `tg-bot/commands/start.js`)
   to open that URL as a Web App.
4. Open the bot in Telegram and tap the button - the Mini App loads,
   detects the Telegram user via `window.Telegram.WebApp`, and initializes
   language from `language_code` automatically.

The Mini App also works as a normal website in any browser (browser
fallback mode), which is how it was built and tested throughout development.

## Netlify Deployment

```text
Base directory:        mini-app
Build command:         npm install --legacy-peer-deps && npm run build
Publish directory:     mini-app/dist
```

`netlify.toml` at the repo root already configures this, including an SPA
fallback redirect (all paths -> `index.html`). To deploy:

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Netlify, "Add new site" -> connect the repo. Netlify will read
   `netlify.toml` automatically.
3. No environment variables are required on the Netlify side yet, because
   there are no Netlify Functions in this MVP (see below).
4. Once deployed, copy the site URL into `TELEGRAM_WEBAPP_URL` (both
   `.env` files) and restart the bot.

`legacy-php/`, `legacy-web-mini-app/`, and `tg-bot/` are **not** part of the
Netlify site - only `mini-app/` is deployed there. PHP does not run on
Netlify.

## Functions

**None exist yet.** The current MVP intentionally uses `localStorage`
instead of Netlify Functions. `mini-app/src/services/storage.ts` is a
clean abstraction boundary so that adding real Netlify Functions later
(`submit-waste.js`, `approve-waste.js`, `withdraw.js`, `rates.js`, a
Telegram `initData`-verifying function, etc.) means swapping the *inside*
of that module (and `telegram.ts`) for `fetch()` calls, without rewriting
any screen's UI code.

## MVP Limitations

Please read this section before treating any part of this project as
production-ready:

- **No shared backend/database.** All data (submissions, wallet, game
  state, withdrawals) lives in the visitor's own browser `localStorage`.
  Nothing is synced between devices, browsers, or to the Telegram Bot.
  Clearing browser data erases everything.
- **Withdrawals are simulated.** No real payment provider is integrated.
  The UI says this explicitly in the Wallet screen.
- **Photo storage is a demo placeholder.** Uploaded photos are stored as
  data URLs inside `localStorage`, which does not scale to real production
  photo storage. A real deployment needs object storage (S3-compatible,
  Cloudinary, Supabase Storage, etc.).
- **Admin access is a demo gate**, not real authorization: the bot's
  `/admin` command checks a hardcoded password (`tg-bot/utils/adminAuth.js`)
  and then opens the Mini App with `?admin=1`, which elevates *whichever*
  Telegram user opens that link to the admin role for that session. It
  must be replaced with real server-side auth before any production use.
- **Telegram `initDataUnsafe` is used for UI/demo purposes only.** It is
  not cryptographically verified. Real authorization must validate
  Telegram's `initData` server-side.
- **The Bot and the Mini App do not share data.** `/profile` in the bot
  shows only Telegram account info, not wallet/game state - see
  `tg-bot/README.md`.
- **`legacy-php/`** contains the original PHP/MySQL backend, kept for
  reference. It is not deployed, not required, and has known issues (e.g.
  a SQL-injection-prone login query) that would need fixing before any
  future reuse.
- **`legacy-web-mini-app/`** is the earlier static HTML/CSS/JS Mini App
  this project replaced. Kept for reference only; not deployed and not
  wired to the bot anymore.

## Future Backend Migration

When a real backend is introduced:

```text
localStorage (now)
      |
      v
Netlify Functions (mini-app/netlify/functions/)
      |
      v
API
      |
      v
Database
```

Because every screen already calls into `StorageService` (and, for
identity, `telegram.ts`) instead of touching `localStorage` directly,
migrating means rewriting the *inside* of those two modules to call
`fetch('/.netlify/functions/...')` instead - the screens' UI stays the same.
