# EcoSort Telegram Bot

Telegram bot for the EcoSort Mini App. Commands: `/start`, `/help`, `/app`, `/profile`, `/admin`.

## What it does

- Before a user taps **Start**, Telegram shows the bot's description
  ("EcoSort — a bot where you can earn money by recycling your waste...").
  This is set automatically on every launch via the Bot API
  (`setMyDescription` / `setMyShortDescription` in `bot.js`) - no manual
  BotFather step needed, though you can still fine-tune it with
  `/setdescription` in [@BotFather](https://t.me/BotFather) if you want.
- `/start` explains what EcoSort does, lists the quick commands, and shows
  buttons: **Open App** and **Change language**. (The Mini App is now a
  single-page app, so there's no separate wallet page to deep-link to -
  the wallet is just a screen inside the app.)
- `/admin` (not shown in the public command menu or `/help`) asks for the
  admin password, then reveals an **Open Admin Panel** button that opens
  the Mini App with `?admin=1` appended to its URL. The Mini App reads that
  query param on load (`mini-app/src/services/telegram.ts`) and elevates
  the Telegram user who opens it to the admin role for that session. This
  uses the same demo password as before (`admin123` by default, see
  `utils/adminAuth.js`) - still just a chat-side convenience gate, not real
  access control.
- Bot replies in **Uzbek by default**, with Russian and English available
  via the "Change language" button. Language preference is per-chat and
  in-memory only (see MVP limitation below).

## Setup

```bash
cd tg-bot
npm install
cp .env.example .env
```

Edit `.env`:

```env
TELEGRAM_BOT_TOKEN=your-bot-token-from-BotFather
TELEGRAM_BOT_USERNAME=your_bot_username
TELEGRAM_WEBAPP_URL=https://your-site.netlify.app/
```

Get a bot token from [@BotFather](https://t.me/BotFather) on Telegram (`/newbot`), and set the Mini App URL to your deployed Netlify site.

## Run

```bash
npm start
```

The bot runs via long polling - a single `node bot.js` process needs to stay
running (locally for development, or on a small always-on host such as
Railway, Render, or a VPS for production). It does **not** run on Netlify;
Netlify hosts the Mini App frontend (`mini-app/`), not this bot.

## MVP limitations

- **The bot and the Mini App do not share a backend or database yet** - the
  Mini App's wallet, coins, and recycling history live only in the
  visitor's browser (`localStorage`), so the bot cannot read or display
  them. `/profile` is honest about this - there's no in-chat balance
  display, only the **Open App** button.
- **Bot-side language preference is in-memory only** (`utils/userLang.js`),
  not persisted to a database - it resets to Uzbek (default) whenever the
  bot process restarts. This is separate from the Mini App's own language
  detection/switching (`mini-app/src/services/translations.ts` and
  `telegram.ts`), since the two don't share data.

Once a real backend/database exists (see the root README's "Future backend
migration" section), both of these can be upgraded to persist properly and
to let the bot show real wallet data.

## Security

`TELEGRAM_BOT_TOKEN` is read only from the environment (`.env`, gitignored).
It is never hardcoded, logged, or shared with the frontend.
